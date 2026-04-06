const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/moods');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Mood Tracker backend is ready to cheer you on!' });
});

app.listen(PORT, () => {
  console.log(`Mood Tracker API running on http://localhost:${PORT}`);
});
