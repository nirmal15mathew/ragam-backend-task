const API_BASE_URL = '/api';
let token = null;



document.body.onload = () => {
  const tok = localStorage.getItem('token')
  if (tok) {
    const { exp } = jwtDecode(tok) // get the expiry
    if (!(Date.now() >= exp * 1000)) {
      token = tok;
      showSection(true)
    }
  }
}

// Show or hide sections based on authentication
function showSection(isAuthenticated) {
  document.getElementById('authSection').classList.toggle('hidden', isAuthenticated);
  document.getElementById('appSection').classList.toggle('hidden', !isAuthenticated);
  if (isAuthenticated) fetchBooks();
}

// Fetch books (Authenticated)
async function fetchBooks() {
  try {
    const response = await fetch(`${API_BASE_URL}/books`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const books = await response.json();
    displayBooks(books);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

function displayBooks(books) {
  const tableBody = document.querySelector('#booksTable tbody');
  tableBody.innerHTML = ''; // Clear previous rows
  books.forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.published_year}</td>
      <td>${book.genre}</td>
      <td>${book.available_copies}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Register a new user
async function registerUser() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const passwd = document.getElementById('regPassword').value;
  const membership = document.querySelector('input[name="membership"]:checked').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, passwd, membership_type: membership })
    });

    if (response.status === 400) {
      const error = await response.json();
      document.getElementById('regError').textContent = error.message || 'Registration failed';
    } else {
      const data = await response.json();
      document.getElementById('regSuccess').textContent = `Registered! UserID: ${data.id}, Email: ${data.email}`;
    }
  } catch (error) {
    console.error('Error registering user:', error);
  }
}

// Log in a user
async function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const passwd = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailid: email, passwd })
    });

    if (response.status === 400) {
      const error = await response.json();
      document.getElementById('loginError').textContent = error.message || 'Login failed';
    } else {
      const data = await response.json();
      token = data.data.token;
      showSection(true);
      localStorage.setItem('token', token)
    }
  } catch (error) {
    console.error('Error logging in:', error);
  }
}

// Add, update, and delete books (Authenticated)
async function addBook() {
  const newBook = {
    title: document.getElementById('addTitle').value,
    author: document.getElementById('addAuthor').value,
    published_year: parseInt(document.getElementById('addYear').value),
    genre: document.getElementById('addGenre').value,
    available_copies: parseInt(document.getElementById('addCopies').value)
  };

  try {
    await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newBook)
    });
    fetchBooks();
  } catch (error) {
    console.error('Error adding book:', error);
  }
}

async function updateBook() {
  const bookId = document.getElementById('updateId').value;
  const updatedBook = {
    title: document.getElementById('updateTitle').value,
    author: document.getElementById('updateAuthor').value,
    published_year: parseInt(document.getElementById('updateYear').value),
    genre: document.getElementById('updateGenre').value,
    available_copies: parseInt(document.getElementById('updateCopies').value)
  };

  try {
    
    await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedBook)
    });
    fetchBooks();
  } catch (error) {
    console.error('Error updating book:', error);
  }
}

async function deleteBook() {
  const bookId = document.getElementById('deleteId').value;

  try {
    const resp = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (resp.status == 403) {
      showSection(false)
    }
    fetchBooks();
  } catch (error) {
    if (error.message === "Invalid or expired token.") {
      showSection(false)
    }
    console.error('Error deleting book:', error);
  }
}

// Initialize
showSection(false);
