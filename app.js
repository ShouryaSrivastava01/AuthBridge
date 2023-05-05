const express = require('express')
const app = express()
const jswt = require('jsonwebtoken');
const crypto = require('crypto');
const auth = require('./auth_user');

const hostname = '127.0.0.1'
let verify
const secret = crypto.randomBytes(32).toString('hex');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

function authToken(req, res, next) {
  const header = req.headers['authorization']
  const token = header && header.split(' ')[1]
  if (token == null) res.sendStatus(401)
  else {

    jswt.verify(token, secret, (err, user) => {
      if (err) res.sendStatus(403)
      req.user = user
      next()
    })
  }

}

app.get('/profile', authToken, (req, res) => {
  res.send(req.user)
})

app.post('/signup', async (req, res) => {

  const result = await auth.authenticateUser(req.body.username, req.body.password, req.body.address);
  console.log(result)

  if (result.status) {

    const token = jswt.sign({ user: req.body.username }, secret, { expiresIn: '1h' });
    res.status(200).json({ accessToken: token })

  } else {
    res.send(result);
  }
});

app.get('/', (req, res) => {
  res.send("hello word app1")
})

app.get('/connect', async (req, res) => {
  const result = await auth.connect();
  console.log(result)

  res.status(200).send(result)
})

app.post('/signout', async (req, res) => {
  const result = await auth.signOut(req.body.address);
  if (result) {

    res.status(200).send(result);
  } else {
    res.status(401).send('Authentication failed');
  }
})

// black box interaction here

app.post('/sign-in', async (req,res)=>{
  const nonce = Math.floor((Math.random() * 100) + 1);
  
  const password = await auth.signIn(req.body.username)
  console.log(typeof password)
  if(typeof password == "object"){
    console.log("imhere")
    res.status(403).send(JSON.stringify(password))
  }
  else{
    verify = crypto.createHash('sha256').update(nonce+password).digest('hex');
    res.send(nonce.toString());
    
  }
  

  
})

app.post('/signin',async (req,res)=>{
 if(req.body.proof == verify){
  const result = await auth.userLoggedIn(req.body.username, req.body.address)
  res.send("authenticated")
 }
 else {
  res.send("Access Denied : Password Incorrect")

 }
})
app.listen(3001, hostname, () => {
  console.log(`listening at http://${hostname}:3001`)
})