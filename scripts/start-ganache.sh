#!/usr/bin/env bash

# Check if ganache is installed
if ! command -v ganache >/dev/null 2>&1; then
    echo "ganache is not installed. Installing..."
    echo ""
    npm i -g ganache
fi

ganache -m 'such quantum luxury shock dentist endorse goose toss lazy crumble begin steel'

# ganache v7.9.2 (@ganache/cli: 0.10.2, @ganache/core: 0.10.2)
# Starting RPC server

# Available Accounts
# ==================
# (0) 0x7b91CeDfCd750Dd7AD80F5D024ae26835518D29d (1000 ETH)
# (1) 0x932c10CEfF230D270Fc75C3dD9Be8259DD116021 (1000 ETH)
# (2) 0xEc7B8B05D32FEe8B60492F77031B32d61fa14C30 (1000 ETH)
# (3) 0x320006FAD6Bf7Aec42ed428F4E7EcC77b87e8Ed9 (1000 ETH)
# (4) 0x9Ebc90815561e330978fE18D29040C31ed86FA79 (1000 ETH)
# (5) 0x80cBA7Ef3677aEc5CA07736De101A7a66d5cd606 (1000 ETH)
# (6) 0x63bc238e1b9d9d150f69C059a7B273EB788c911a (1000 ETH)
# (7) 0xCd0A9EC7540eDDFC384A2CB248181301Cd61c1Ea (1000 ETH)
# (8) 0x76cA02171641A33cf770B593e56ceE27E003B2d8 (1000 ETH)
# (9) 0x58E4aebed358eA9Db720d41C523997F531Df1083 (1000 ETH)

# Private Keys
# ==================
# (0) 0xa62c203757789ec2bd2ac5480955eb2dc21275725a60b3c9c7b889172da3abd0
# (1) 0x5002b268f61cb2033689c9129a826f1859ce7ca46d468a14c14082d1a83d134d
# (2) 0x6cfec6e6fa245da55f946063905264605340c1bba7e43d733206bb2d598e2477
# (3) 0x7e6a2441d66c2583f10ae166b28cd26ddc19d92106c709a1c3b9af3a3ab03645
# (4) 0x3cc714b25804be5c11865610e3b899f15266fd69f9dfb210be94a7991b3ba739
# (5) 0x0a0b99621189f8244aad6802d395029355c38d58d98ae7f1c3476a5473551c80
# (6) 0x690dc021cb469a482633177366b873efd8122629eea331e409e7e493b53dc05e
# (7) 0xf0875d073fb596ac0f20b7c87f52828f9cabbb6fbd3fe2b2cb53862147e67276
# (8) 0x9af3998d2d94258a8ac582ea649d80d6d54025e71063b8c2c735b687455a28be
# (9) 0x9610c082c393ca82687d393ea7367b980136005eb11902417b22020443a21c20

# HD Wallet
# ==================
# Mnemonic:      such quantum luxury shock dentist endorse goose toss lazy crumble begin steel
# Base HD Path:  m/44'/60'/0'/0/{account_index}

# Default Gas Price
# ==================
# 2000000000

# BlockGas Limit
# ==================
# 30000000

# Call Gas Limit
# ==================
# 50000000

# Chain
# ==================
# Hardfork: shanghai
# Id:       1337

# RPC Listening on 127.0.0.1:8545
