//Solidity Version// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 < 0.9.0;

contract Authentication {
    struct User {
        string username;
        string password;
        bool isLoggedIn;
    }

    mapping(address => User) public users;

    event UserSignUp(address indexed userAddress, string username);
    event UserSignIn(address indexed userAddress, string username);

    function signUp(string memory _username, string memory _password) public {
        require(users[msg.sender].isLoggedIn == false, "User already signed up");
        users[msg.sender] = User(_username, _password, true);
        emit UserSignUp(msg.sender, _username);
    }

    function signIn(string memory _username, string memory _password) public {
        require(users[msg.sender].isLoggedIn == false, "User already signed in");
        require(keccak256(bytes(users[msg.sender].username)) == keccak256(bytes(_username)), "Invalid username");
        require(keccak256(bytes(users[msg.sender].password)) == keccak256(bytes(_password)), "Invalid password");
        users[msg.sender].isLoggedIn = true;
        emit UserSignIn(msg.sender, _username);
    }

    function signOut() public {
        require(users[msg.sender].isLoggedIn == true, "User not signed in");
        users[msg.sender].isLoggedIn = false;
    }
}
