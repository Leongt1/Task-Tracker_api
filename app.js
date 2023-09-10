require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const db = require('./config/database');

const taskRoutes = require('./routes/task.route');
const singupRoutes = require('./routes/signup.route');
const loginRoutes = require('./routes/login.route');
const refreshTokenRoutes = require('./routes/refresh.route');
const logoutRoutes = require('./routes/logout.route');

const verifyJWT = require('./middlewares/verifyJWT');

const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend's URL
  methods: 'GET,PUT,POST,DELETE',
};

const app = express();

app.use(cors(corsOptions));

// middleware for handling form data
app.use(express.urlencoded({ extended: false }));

// middleware for handling json data
app.use(express.json());

// middleware for handling cookie data
app.use(cookieParser());
app.use('/api/signup', singupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/refresh', refreshTokenRoutes);
app.use('/api/logout', logoutRoutes);

app.use(verifyJWT); // verifying jwt
app.use('/api/tasks', taskRoutes);

db.initDb()
  .then(() => {
    app.listen(PORT);
    console.log(`Running on port: ${PORT}`)
  })
  .catch((err) => {
    console.log('Connecting to database failed!', err);
  });
