import express from 'express'
const app = express()
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken'
import { addBook, getBook, updateBook, deleteBook, getAllBooks, registerUser, loginUser } from './store.js'

const port = 3000;

app.use(express.static('public'))


// create application/json parser
let jsonParser = bodyParser.json()

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']
  const idToken = token.split(' ')[1]
  if(token) {
    jwt.verify(idToken, 'myscretkey', (err, decoded) => {
    if(err) {
         return res.status(400).send('Session expired')
    }
    next()    
    })    
}

};



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/books', getAllBooks)

app.post('/api/books', jsonParser, verifyToken, addBook);

app.get('/api/books/:id', getBook)


app.put('/api/books/:id', jsonParser, verifyToken, updateBook)


app.delete('/api/books/:id', verifyToken, deleteBook);

app.post('/api/auth/login', jsonParser, loginUser)

app.post('/api/auth/register', jsonParser, registerUser);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})