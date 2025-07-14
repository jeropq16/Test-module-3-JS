# Test-module-3-JS

 Events Management SPA

This project is a simple Single Page Application (SPA) for managing a events, including users, events, and new events. It is built using vanilla JavaScript, HTML, and CSS, and uses a REST API (such as [json-server](https://github.com/typicode/json-server)) for data persistence.

---

## Project Structure and File Descriptions

### `main.js`
This is the main JavaScript file that contains all the core logic for the application.  
**Key responsibilities:**
- **Routing:** Handles SPA navigation using URL hashes and dynamically loads HTML views into the main container.
- **Authentication:** Manages login, logout, and role-based access (admin/user) using `localStorage`.
- **CRUD Operations:** Implements Create, Read, Update, and Delete for users, events by making HTTP requests to the REST API.
- **Dynamic Tables:** Renders tables for admins and users, including buttons for editing and deleting records. Prompts are used for editing, and tables refresh automatically after changes.
- **Form Handling:** Handles form submissions for login, registration, and adding new events.
- **Session Management:** Provides a logout button and ensures users are redirected appropriately based on their authentication state and role.

---

### `vistas/` (HTML Views)
This folder contains the HTML partials loaded dynamically by the router in `main.js`.  
**Files include:**
- `login.html`: Login form for users and admins.
- `formRegistro.html`: Registration form for new users.
- `admin.html`: Admin dashboard with tables for users, and events.
- `usuario.html`: User dashboard with available events and reservation history.
- `formAgregar.html`: Form for adding new events.
- `formModificar.html`: (If used) Form for editing existing records.

Each view is loaded into the main container (`#contenedor-index`) based on the current route.

---

### `db.json` (API Data)
This file is used by [json-server](https://github.com/typicode/json-server) or a similar REST API to store and serve data for:
- Users (`/usuarios`)
- Books (`/libros`)
- Reservations (`/reservas`)

You can start the API locally with:
```bash
json-server --watch db.json --port 3000
```

---

## How to Run

1. **Start the API:**  
   Make sure you have `json-server` installed and run it with your `db.json`.

2. **Open the App:**  
   Open `index.html` in your browser. The SPA will handle navigation and data management.

3. **Login/Register:**  
   Use the login or registration forms to access the app as a user or admin.

---

## Notes

- All logic is handled in `main.js` using vanilla JavaScript and the Fetch API.
- The CSS file (`style.css`) provides a modern and responsive design for the app.
- No frameworks are required; everything runs
