const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.previousHash +
          this.timestamp +
          JSON.stringify(this.data)
      )
      .digest("hex");
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "06/04/2024", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    // newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    // this.chain.push(newBlock);
    mineBlock(newBlock, this.difficulty);
    this.chain.push(newBlock);
  }

  isValidChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// Generate a new key pair
function generateKeyPair() {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048, // Length of the key in bits
    publicKeyEncoding: {
      type: "spki", // Public Key Infrastructure
      format: "pem", // Privacy Enhanced Mail format
    },
    privateKeyEncoding: {
      type: "pkcs8", // Public Key Cryptography Standards #8
      format: "pem", // Privacy Enhanced Mail format
    },
  });
}
// Create a new instance of Express
const app = express();

// Create a new instance of Blockchain
let myBlockchain = new Blockchain();

// Middleware for parsing JSON body
app.use(bodyParser.json());

app.get("/account", (req, res) => {
  const { publicKey, privateKey } = generateKeyPair();
  res.json({ publicKey, privateKey });
});

// maintaining the integrity of thechain
// popular consensus algorithms
// To add functionality to the blockchain for maintaining the integrity of the chain, you can implement a consensus algorithm. A consensus algorithm is a mechanism that allows nodes in a distributed system to come to an agreement on the current state of the chain. Some popular consensus algorithms include:

// 1 - Proof of Work (PoW): In PoW, miners must solve a complex mathematical puzzle in order to add a new block to the chain. The first miner to solve the puzzle gets to add the block and is rewarded with a certain number of cryptocurrency coins. This helps to prevent malicious actors from tampering with the blockchain.
// 2 - Proof of Stake (PoS): In PoS, the probability of a node being chosen to add a new block to the chain is proportional to the amount of cryptocurrency coins that the node holds. This helps to prevent malicious actors from tampering with the blockchain.
// 3 - Delegated Proof of Stake (DPoS): In DPoS, nodes are elected as delegates to represent the interests of the community. The delegates are responsible for adding new blocks to the chain and are rewarded with cryptocurrency coins.
// 4 - Practical Byzantine Fault Tolerance (PBFT): In PBFT, nodes must reach a consensus by exchanging messages. PBFT is suitable for permissioned blockchain where nodes have known identities.
// By implementing a consensus algorithm, you can ensure that all nodes in the network are in agreement on the current state of the chain, and that any conflicts are detected and resolved in a timely manner.

// get a#block chain
// Endpoint to get the entire blockchain
app.get("/blockchain", (req, res) => {
  res.json(myBlockchain);
});

// add data
// Endpoint to add a new block
app.post("/block", (req, res) => {
  const { data } = req.body;
  const newBlock = new Block(
    myBlockchain.chain.length,
    new Date().toLocaleDateString(),
    data
  );
  myBlockchain.addBlock(newBlock);
  res.json(newBlock);
});

function mineBlock(block, difficulty) {
  while (
    block.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
  ) {
    block.nonce++;
    block.hash = SHA256(
      block.index + block.timestamp + block.data + block.nonce
    ).toString();
  }
  console.log("Block mined: " + block.hash);
}

// Endpoint to create a new transaction
app.post("/transaction", (req, res) => {
  const { sender, recipient, amount } = req.body;
  // Here you would handle the transaction, e.g., update wallet balances, etc.
  res.json({
    message: `Transaction from ${sender} to ${recipient} for ${amount} processed successfully`,
  });
});

// Endpoint to get wallet details
app.get("/wallet/:address", (req, res) => {
  const { address } = req.params;
  // Here you would retrieve wallet details for the given address
  res.json({ address, balance: 100 }); // Example response, replace with actual wallet details
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
