import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'

const exampleBook = {
  id: crypto.randomUUID(),
  title: "A Brief History of Time",
  author: "Dr Stephen Hawking",
  published_year: "1988",
  genre: "Popular Science",
  available_copies: 129,
};

const books = [exampleBook];
const users = [];

// Managing Books

function getAllBooks(req, res) {
  res.send(books);
}

function addBook(req, res) {
  // add new book
  const newBook = req.body;

  books.push(newBook);

  res.send({
    message: "New Book Added",
  });
}

function getBook(req, res) {
  const bookId = req.params.id;
  let bookNotFound = true;

  for (let book of books) {
    if (book.id == bookId) {
      return res.send(book);
    }
  }

  res.status(404).json({ error: "Book not found" });
}

const updateBook = (req, res) => {
  const bookId = req.params.id;
  const book = books.find((t) => t.id === bookId);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  book.title = req.body.title || book.title;
  book.author = req.body.author || book.author;
  book.published_year = req.body.published_year || book.published_year;
  book.genre = req.body.genre || book.genre;
  book.genre = req.body.genre || book.genre;
  res.json(book);
}

const deleteBook = (req, res) => {
  const id = req.params.id;
  const index = books.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  books.splice(index, 1);
  res.status(204).send();
}

// Managing Users

const registerUser = (req, res) => {
    const { name, email, membership_type, passwd } = req.body;
    console.log(name, email, membership_type, passwd)
    
    if (users.find((u) => u.email === email)) {
        // check if the user exists
        return res.status(400).json({
            error: "User already Exists",
        });
    } else {
        // generate new id and set date
        const id = crypto.randomUUID();
        const date = new Date().getDate();
        
        const salt = crypto.randomBytes(16).toString("hex");
    const passHash = crypto
      .pbkdf2Sync(passwd, salt, 1000, 64, "sha512")
      .toString("hex");

    const dbDoc = {
      id,
      name,
      date,
      email,
      membership_type,
      passHash,
      salt,
    };

    users.push(dbDoc);

    let token;
    try {
      token = jwt.sign(
        {
          userId: id,
          email,
        },
        salt,
        { expiresIn: "5h" }
      );
    } catch (err) {
      const error = new Error("Error! Something went wrong.");
      return next(error);
    }
    res.status(201).json({
      success: true,
      data: {
        userId: id,
        email: email,
        token: token,
      },
    });
  }
}

const getUser = (req, res) => {}

const loginUser = (req, res) => {}

// app.get("/api/auth/register", (req, res) => {});
// app.get("/api/auth/login", (req, res) => {});

export {
  books,
  users,
  getBook,
  updateBook,
  deleteBook,
  addBook,
  getAllBooks,
  registerUser,
  getUser,
  loginUser,
};