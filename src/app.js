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
const connectDB = require('./models/db');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 8000;

connectDB();

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


app.use('/api/users',userRoutes);
app.use('/api/projets',projetRoutes);
app.use('/auth',authRoutes);
app.use('/api/profiles',profilRoutes);


app.listen(port, ()=>{
    console.log(`Serveur starting and running in port ${port}`);
})
