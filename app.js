const express = require('express')
const app = express()
const auth = require('./auth_user');

const hostname='127.0.0.1'
// Define an API endpoint for user authentication
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/signup', async (req, res) => {
 
  // Call the authenticateUser function to authenticate the user
  const result = await auth.authenticateUser(req.body.username, req.body.password, req.body.address);

//   // Return the appropriate response based on the authentication result
  if (result) {

    res.status(200).send(result);
  } else {
    res.status(401).send('Authentication failed');
  }
});

app.get('/', (req,res)=>{
    res.send("hello word app1")
})

app.get('/connect', (req,res)=>{
    const result = auth.connect();
    res.status(200).send(result)
})

app.get('/signout', async (req,res)=>{
    const result = await auth.signOut(req.body.address);
    if (result) {

        res.status(200).send(result);
      } else {
        res.status(401).send('Authentication failed');
      }
})

app.get('/signin', async(req, res)=>{
    const result = await auth.signIn(req.body.username, req.body.password, req.body.address);
    if(result) res.status(200).send(result)
    else res.status(401).send(result)
})
app.listen(3001, hostname, ()=>{
    console.log(`listening at http://${hostname}:3001`)
})
