# Ragam Backend Task


## How to Run ?

1. download this repo using `git clone <repo_url>` or gui
2. go to the folder and open terminal, type `npm install` (Make sure node is installed)
3. type `npm run dev` to start the server locally


## Endpoints

### For Books

- `GET:/api/books` Gets all the books
- `GET:/api/books/:id` Gets the book with `id`
- `POST: /api/books` Add new book
- `PUT: /api/books/:id` update the particular book with `id`
- `DELETE: /api/books/:id` Delete particular book


### For Users

- `POST: /api/auth/register` to register new user with email id and password
- `POST: /api/auth/login` verify login with particular email id and password