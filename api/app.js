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
const TontineRoutes = require('./routes/TontineRoutes');
const Auth = require('./routes/authRoutes');
const connectDB = require('./models/db');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const EventRoutes = require('./routes/EventRoutes');
const path = require('path');
const SeanceRoutes = require('./routes/seanceRoutes');
const ParticipationRoutes = require('./routes/participations')
const SaisonRoutes = require('./routes/saisonRoutes')
const SanctionRoutes = require('./routes/sanctions')
const AutoSanctionRoutes = require('./routes/automatisation_sanctions')

const app = express();
const port = process.env.PORT || 8000;

connectDB();

const corsOptions = {
  origin: '*', // or specify your specific origins
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Content-Type',
};




app.use(cors(corsOptions));

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
app.use('/api/tontine',TontineRoutes);
app.use('/api/seance',SeanceRoutes);
app.use('/api/participations',ParticipationRoutes);
app.use('/api/saisons',SaisonRoutes);
app.use('/api/sanctions',SanctionRoutes);
app.use('/api/automatisation_sanction',AutoSanctionRoutes)

app.listen(port, ()=>{
    console.log(`Serveur starting and running in port ${port}`);
})

// module.exports = app;
