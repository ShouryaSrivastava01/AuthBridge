//Solidity Version// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 < 0.9.0;

contract  Auth{

  struct User {
    string username;
    string password;
    bool loggedIn;
  }

  mapping (address => User) public users;

  event SignUp(address userAddress, string username);
  event SignIn(address userAddress, string username);
  event SignOut(address userAddress, string username);

  function signUp(string memory _username, string memory _password) public {
    require(bytes(_username).length > 0, "Username cannot be empty.");
    require(bytes(_password).length > 0, "Password cannot be empty.");
    require(users[msg.sender].loggedIn == false, "User is already registered.");

    users[msg.sender] = User(_username, _password, true);
    emit SignUp(msg.sender, _username);
  }

  function signIn(string memory _username, string memory _password) public {
    require(bytes(_username).length > 0, "Username cannot be empty.");
    require(bytes(_password).length > 0, "Password cannot be empty.");
    require(users[msg.sender].loggedIn == false, "User is already logged in.");
    require(keccak256(bytes(_username)) == keccak256(bytes(users[msg.sender].username)), "Username does not match.");
    require(keccak256(bytes(_password)) == keccak256(bytes(users[msg.sender].password)), "Password does not match.");

    users[msg.sender].loggedIn = true;
    emit SignIn(msg.sender, _username);
  }

  function signOut() public {
    require(users[msg.sender].loggedIn == true, "User is not logged in.");

    string memory username = users[msg.sender].username;
    users[msg.sender].loggedIn = false;
    emit SignOut(msg.sender, username);
  }
}