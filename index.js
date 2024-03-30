require("dotenv").config();
const { Telegraf } = require("telegraf");
const Web3 = require("web3");
const chalk = require("chalk");
const sharp = require("sharp");
const svgCaptcha = require("svg-captcha");
const fs = require("fs");
const web3 = new Web3(process.env.INFURA_API_URL);
const bot = new Telegraf(process.env.BOT_TOKEN);
const txUrl = "https://testnet.bscscan.com/tx/";
const faucetWalletPrivateKey = process.env.WALLET_PRIVATE_KEY;
const faucetWalletAddress = web3.eth.accounts.privateKeyToAccount(
  faucetWalletPrivateKey,
).address;

const lastClaimTimestamps = {};
const captchaSolutions = {};

const logger = fs.createWriteStream("info.txt", {
  flags: "a",
});

// Function to get and display the faucet's balance
async function displayFaucetBalance() {
  const balanceWei = await web3.eth.getBalance(faucetWalletAddress);
  const balanceBNB = web3.utils.fromWei(balanceWei, "ether");
  console.log(
    chalk.green(
      "\n\t ━━━━━━━━━━━━━━━━━━━━ Faucet Details ━━━━━━━━━━━━━━━━━━━━ \n",
    ),
  );
  console.log("\t   Address: " + chalk.cyan(faucetWalletAddress));
  console.log(
    chalk.yellow(
      "\t\t\t Balance: " + chalk.green.underline.bold(balanceBNB) + " BNB",
    ),
  );
}

displayFaucetBalance();

bot.start((ctx) => {
  ctx.reply(
    "Welcome to the BNB Faucet Bot.\nSend your BNB address to receive some BNB.\nOr send /help to see the list of commands.\n",
  );
});

bot.command("donate", (ctx) => {
  ctx.reply(
    "To donate to the faucet\n" +
      "Send any amount of BNB to:\n" +
      "0x7b91CeDfCd750Dd7AD80F5D024ae26835518D29d",
  );
});

// Add the /help command section
bot.command("help", (ctx) => {
  ctx.reply(
    "Available commands:\n" +
      "/start - Start interacting with the bot.\n" +
      "/balance - Check the faucet's current balance.\n" +
      "/donate - Show donation details.\n" +
      "/help - Show this list of commands.",
  );
});

bot.command("balance", async (ctx) => {
  const balanceWei = await web3.eth.getBalance(faucetWalletAddress);
  const balanceBNB = web3.utils.fromWei(balanceWei, "ether");
  ctx.reply(`Faucet's current balance: ${balanceBNB} BNB`);
});

bot.on("text", async (ctx) => {
  const inputText = ctx.message.text.trim();
  const userId = ctx.from.id;

  // Check if the user is responding to a CAPTCHA challenge.
  if (captchaSolutions[userId]) {
    if (inputText.toLowerCase() === captchaSolutions[userId].solution) {
      // Retrieve the stored address for the user
      const userAddress = captchaSolutions[userId].address;

      if (web3.utils.isAddress(userAddress)) {
        delete captchaSolutions[userId]; // CAPTCHA verified, remove it
        lastClaimTimestamps[userId] = new Date(); // Update the last claim time

        await sendBNB(ctx, userAddress); // Send BNB to the stored address
      } else {
        ctx.reply(
          "The stored BNB address is invalid. Please restart the process.",
        );
      }
    } else {
      ctx.reply("Incorrect CAPTCHA. Please try again.");
    }
    return; // Prevent further processing after handling CAPTCHA response
  }

  // Handle new address submissions.
  if (web3.utils.isAddress(inputText)) {
    // Check for claim cooldown (24-hour limit)
    if (
      lastClaimTimestamps[userId] &&
      new Date() - new Date(lastClaimTimestamps[userId]) < 24 * 60 * 60 * 1000
    ) {
      ctx.reply(
        "You can only claim BNB once every 24 hours. Please try again later.",
      );
      return;
    }

    const captcha = svgCaptcha.create();
    captchaSolutions[userId] = {
      solution: captcha.text.toLowerCase(),
      address: inputText,
    };

    sharp(Buffer.from(captcha.data))
      .png()
      .toBuffer()
      .then((pngBuffer) => {
        ctx.replyWithPhoto(
          { source: pngBuffer },
          { caption: "Please solve this CAPTCHA to receive BNB." },
        );
      })
      .catch((err) => {
        console.error("Error converting SVG to PNG: ", err);
        ctx.reply("Failed to generate CAPTCHA. Please try again.");
      });
  } else {
    ctx.reply("Please send a valid BNB address.");
  }
});

async function sendBNB(ctx, address) {
  try {
    const nonce = await web3.eth.getTransactionCount(
      faucetWalletAddress,
      "latest",
    );

    const randomAmountBNB = (Math.random() * (0.01 - 0.001) + 0.001).toFixed(5);

    const value = web3.utils.toWei(randomAmountBNB, "ether");

    const transaction = {
      to: address,
      value: value,
      gas: 3000000,
      nonce: nonce,
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      faucetWalletPrivateKey,
    );

    const txReceipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    );

    ctx.reply(
      "Sent " +
        randomAmountBNB +
        " BNB to: " +
        address +
        "\n\nTx Hash: " +
        txUrl +
        txReceipt.transactionHash +
        "\n",
    );

    console.log(
      "\nSent " +
        chalk.green(randomAmountBNB + " BNB to: ") +
        chalk.cyan(address) +
        "\nTx Hash: " +
        chalk.yellow(txUrl + txReceipt.transactionHash),
    );

    logger.write(
      "UserID: " +
        ctx.from.id +
        "\n" +
        "Requested " +
        randomAmountBNB +
        " BNB to: " +
        address +
        "\nTx Hash: " +
        txUrl +
        txReceipt.transactionHash +
        "\n\n",
    );
  } catch (error) {
    ctx.reply("Sorry, something went wrong.");
    console.error("Error sending BNB:", error);
  }
}

bot.launch();
