const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Middleware: check if logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/');
}

// Serve login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,  'login.html'));
});

// Serve register page
app.get('/sign', (req, res) => {
    res.sendFile(path.join(__dirname, 'sign.html'));
});

// Handle registration
app.post('/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.send('❌ Passwords do not match. <a href="/sign">Try again</a>');
    }

    const users = readUsersFromFile();

    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.send('❌ User already exists. <a href="/sign">Try again</a>');
    }

    // Create new user
    const newUser = { username, password, role: 'user' }; // Default role as 'user'
    users.push(newUser);

    writeUsersToFile(users);

    // Log in the user immediately after registration
    req.session.user = newUser;
    res.send('✅ Registration successful! <a href="/">Go to Home</a>');
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const users = readUsersFromFile();

    // Find user by username
    const foundUser = users.find(user => user.username === username);
    if (foundUser && foundUser.password === password) { 
        // Store user details in the session
        req.session.user = foundUser;
        res.send('✅ Login successful! <a href="/">Go to Home</a>');
    } else {
        res.send('❌ Invalid credentials. <a href="/">Try again</a>');
    }
});

// Helper functions to read/write users from/to file
function readUsersFromFile() {
    const usersFile = path.join(__dirname, 'users.json');
    try {
        if (fs.existsSync(usersFile)) {
            const data = fs.readFileSync(usersFile, 'utf-8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Error reading users file:', err);
    }
    return [];
}

function writeUsersToFile(users) {
    const usersFile = path.join(__dirname, 'users.json');
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error writing users file:', err);
    }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});