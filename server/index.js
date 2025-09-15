const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const verifyToken = require('./middlewares/auth');
const authRoutes = require('./routes/authRoutes');
const { encrypt , decrypt } = require('./encrypt')
const PasswordModel = require('./models/PasswordModel');

const app = express();

dotenv.config({ path: "../.env" });
// dotenv.config();

const allowedOrigins = [
  'https://safe-frontend-swart.vercel.app',
  'http://localhost:5173',
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};

// Place this at the top, right after express initialization
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use(express.json());
app.use('/auth', authRoutes); 

const DB = process.env.DB;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connection success.");
})
.catch((error) => {
    console.log(error);
});


app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.post('/addpassword', verifyToken, async(req, res) => {
    const { password, title } = req.body;
    const hashedPassword = encrypt(password);
    const userId = req.userId;
    try {
        const passwordEntry = new PasswordModel({
            password: hashedPassword.password,
            title,
            iv: hashedPassword.iv,
            user: userId,
        });
        
        await passwordEntry.save();
        res.status(201).json({ message: 'Password entry saved successfully' });
    } catch (err) {
        console.error(err);
        
        if (err.name === 'ValidationError') {
            return res.status(400).json(err.errors);
        }
        
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/showpasswords', verifyToken, async(req, res) => {
    try {
        const userId = req.userId;
        const result = await PasswordModel.find({user: userId}).exec();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post("/decryptpassword", (req, res) => {
    res.send(decrypt(req.body));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
