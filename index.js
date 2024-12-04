import express from 'express'
const app = express()
import bodyParser from 'body-parser';
import { addBook, getBook, updateBook, deleteBook, getAllBooks, registerUser } from './store.js'

const port = 3000;


// create application/json parser
let jsonParser = bodyParser.json()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/books', getAllBooks)

app.post('/api/books', jsonParser, addBook);

app.get('/api/books/:id', getBook)


app.put('/api/books/:id', jsonParser, updateBook)


app.delete('/api/books/:id', deleteBook);

app.post('/api/auth/login', jsonParser, (req, res) => {
  
})

app.post('/api/auth/register', jsonParser, registerUser);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})