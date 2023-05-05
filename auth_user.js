// Import the Web3.js library and ABI file for your smart contract
const Web3 = require('web3');
const jwt = require('jsonwebtoken');
const abi = require('./contractABI2.json');

// Set up a Web3.js provider to connect to your blockchain network

const contractAddress = '0xB031bcbb8e0B5c2c866A15625860CB0c40B3A856';
// const contractAddress = '0x5Cfe413786d6B7426F33648145DA0E4EbDD449c0';
// const contractAddress = '0xf53Cfb2d7b2BDb8C707a871AbDe89BB16c1180e6';
var contractInstance
async function connect() {
    try {
        const provider = await new Web3.providers.HttpProvider('http://localhost:7545');
        const web3 = new Web3(provider);
        contractInstance = new web3.eth.Contract(abi, contractAddress);
        return contractInstance
    } catch (err) {
        console.log(err)
    }
}

async function authenticateUser(username, password, address) {
    await connect()
    if (!contractInstance) return [{ status: false, message: "Connection not established" }]
    try {
        const result = await contractInstance.methods.signUp(username, password).send({ from: address, gas: 3000000 })
        return [{ status: true, message: result }]
    } catch (error) {
        return [{ status: false, message: error }]
    }



}

async function signOut(address) {
    await connect()
    try {
        const result = await contractInstance.methods.signOut().send({ from: address })
        console.log("logout")
        return "logged out"
    } catch (error) {
        console.log("error in log out")
        return error
    }
}

async function signIn(username) {
    await connect();
    if (!contractInstance) return "unsuccessful"

    try {
        const res = await contractInstance.methods.getData(username).call()
        return res
    } catch (error) {
        return error
    }
}

async function userLoggedIn(username, address){
    await connect();
    if(!contractInstance) return "unsuccessful"
    try{
        const res = await contractInstance.methods.signIn(username).send({from: address, gas: 3000000})
        return res
    }catch(error){
        return error
    }
}

// Export the authenticateUser function as an API endpoint
module.exports = { authenticateUser, connect, signOut, signIn, userLoggedIn};
