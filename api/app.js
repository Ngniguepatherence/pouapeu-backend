const express = require('express');
const mongoose=  require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const projetRoutes = require('./routes/projetRoutes');
require('./models/passportConfig')(passport);
require('dotenv').config();
const authRoutes = require('./routes/googleRoutes');
const profilRoutes = require('./routes/profilRoutes');
const Auth = require('./routes/authRoutes');
const connectDB = require('./models/db');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const EventRoutes = require('./routes/EventRoutes');
const path = require('path');


const app = express();
const port = process.env.PORT || 8000;

connectDB();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
app.use(
    session({
        secret: 'SECRET',
        resave: true,
        saveUninitialized: true,
    })
  );
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/files',express.static(path.join(__dirname, '/uploads')));
app.use('/api/avatar',express.static(path.join(__dirname, '/uploads/avatars')));

const verifyToken = (req,res,next) => {
  const token = req.headers['authorization'];
  if(!token) {
    return res.status(403).send('Token is required for authentification');
  }

  jwt.verify(token, 'password123', (err, user) => {
    if(err) {
      return res.status(403).send('Invalid token');
    }
    req.user = user;
    next();
  })
}


app.use('/api/users',userRoutes);
app.use('/api/projets',projetRoutes);
app.use('/auth',authRoutes);
app.use('/api/profiles',profilRoutes);
app.use('/api/auth', Auth);
app.use('/api/events', EventRoutes);

app.listen(port, ()=>{
    console.log(`Serveur starting and running in port ${port}`);
})

// module.exports = app;
