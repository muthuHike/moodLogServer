const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();
const usersFile = path.join(__dirname, '..', 'data', 'users.json');
const SECRET = 'mood-tracker-secret';

function loadUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf8')) || [];
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Email or password is incorrect.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const users = loadUsers();
  const exists = users.some((u) => u.email === email);

  if (exists) {
    return res.status(409).json({ message: 'This email is already registered.' });
  }

  const newUser = {
    id: `${Date.now()}`,
    name,
    email,
    password
  };

  users.push(newUser);
  saveUsers(users);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

module.exports = router;
