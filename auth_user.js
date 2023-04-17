// Import the Web3.js library and ABI file for your smart contract
const Web3 = require('web3');
const abi = require('./contractABI.json');

// Set up a Web3.js provider to connect to your blockchain network

const contractAddress = '0x5Cfe413786d6B7426F33648145DA0E4EbDD449c0';
// const contractAddress = '0xf53Cfb2d7b2BDb8C707a871AbDe89BB16c1180e6';
var contractInstance
function connect() {
    const provider = new Web3.providers.HttpProvider('http://localhost:7545');
    const web3 = new Web3(provider);
    contractInstance = new web3.eth.Contract(abi, contractAddress);
}

// Set up an instance of your smart contract using the Web3.js library and ABI file

// Define a function to authenticate a user using your smart contract
async function authenticateUser(username, password, address) {
    connect()
    if (!contractInstance) return "unsuccessful"
    try {

        const result = await contractInstance.methods.signUp(username, password).send({ from: address, gas: 3000000 })
        return result
    } catch (error) {
        return error
    }



}

async function signOut(address) {
    try {
        await contractInstance.methods.signOut().send({ from: address })
        // console.log(result)
        return "logged out"
    } catch (error) {
        return "error"
    }
}

async function signIn(username, password, address) {
    connect();
    if (!contractInstance) return "unsuccessful"

    try {
        const res = await contractInstance.methods.signIn(username, password).send({ from: address, gas: 3000000 })
        return res
    } catch (error) {
        console.log(error)
        return error
    }
}

// Export the authenticateUser function as an API endpoint
module.exports = { authenticateUser, connect, signOut, signIn };
