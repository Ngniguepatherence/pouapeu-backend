require('dotenv').config();
const Mongoose = require('mongoose');

const connectDB = async () => {
    await Mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log('Database connected')}


module.exports = connectDB;