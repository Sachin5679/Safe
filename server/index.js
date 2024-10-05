const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require('body-parser');
const verifyToken = require('./middlewares/auth');
const authRoutes = require('./routes/authRoutes')
const PasswordModel = require('./models/PasswordModel')


const app = express();
app.use(cors());

const { encrypt, decrypt } = require('./encrypt');

app.use(express.json());
app.use(bodyParser.json());
dotenv.config({ path: "./.env" });
const DB = process.env.DB;

app.use('/auth', authRoutes)


mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() =>
{
    console.log("Connection success.");
})
.catch((error) =>
{
    console.log(error)
})

const PORT = 3003;

app.get("/", (req, res) => {
    res.send("Hello World!")
})

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
})

app.get('/showpasswords', verifyToken, async(req, res) => {
    try {
        const userId = req.userId;
        const result = await PasswordModel.find({user: userId}).exec();
        res.status(200).json(result);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

app.post("/decryptpassword", (req, res) => {
    res.send(decrypt(req.body));
})

app.listen(PORT, () => {
    console.log("Server running....");
})
