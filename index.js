const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');



// Cors
// const cors = require('cors');
// app.use(cors());


const app = express();

const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');

// Penyimpanan gambar
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

// Filter Gambar
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

// Middleware
// Izinkan gambar di akses dipostman
app.use('/images', express.static(path.join(__dirname, 'images')));

// Body Parser Postman
app.use(bodyParser.json()) //type json

// middleware gambar
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

// Izinkan Enable CORS Origin
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

// Grouping routes
app.use(('/v1/auth'), authRoutes);
app.use(('/v1/blog'), blogRoutes);

// Response Error Client Postman
app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({message: message, data: data});
})

// Koneksi Database Menggunakan Moongose
mongoose.connect('mongodb+srv://riczky:H1f7Qhcp1kzGB4kp@cluster0.lm7co.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => {
    app.listen(4000, () => console.log('Connection Success'));
})
.catch(err => console.log(err));


