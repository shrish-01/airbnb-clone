
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const User = require("./models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader")
const Place = require('./models/Place.js');
const multer = require('multer');
const fs = require('fs');
require("dotenv").config();
const app = express();

// eslint-disable-next-line no-unused-vars
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "ifweyg32ygyfv873bugsvf82vfegvwed2";

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

mongoose.connect("mongodb://localhost:27017/booking-app");

app.get("/test", (req, res) => {
  res.json("tested");
});

// Below sets a collection in the db named users & you can also get that at 4000/users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {firstName, lastName, email, id} = await User.findById(userData.id);
      res.json({firstName, lastName, email, id});
    });
  } else {
    res.json(null);
  }
  // res.json(token);
});

app.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Place.find({owner: id}) )
  });
});

app.get('/places/:id', async (req, res) => {
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.get('/places', async (req, res) => {
  res.json( await Place.find() );
});

app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const { id, title, address, addedPhotos, description, 
    perks, extraInfo, checkIn, checkOut, maxGuests, price,
  } = req.body;
  
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const placeDoc = await Place.findById(id);
    if(userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos:addedPhotos, description, 
      perks, extraInfo, checkIn, checkOut, maxGuests,price,
      })
      await placeDoc.save();
      res.json('ok');
    }
  });

});

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      // res.json('found');
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json("pass not okay");
      }
    } else {
      res.status(422).json("not found");
    }
  } catch (e) { /* empty */ }
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';

    await imageDownloader.image({
      url: link,
      dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);  
});

const photosMiddleware = multer({dest: 'uploads'});

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    // const fileInfo = req.files[i];
    const {path, originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads/', ''));
  }
  res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
  const { token } = req.cookies;
  const { title, address, addedPhotos, description, 
    perks, extraInfo, checkIn, checkOut, maxGuests, price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, photos:addedPhotos, description, 
    perks, extraInfo, checkIn, checkOut, maxGuests,price,
    });
    res.json(placeDoc);
  });

});

// connectDB();
app.listen(4000, () => {
  console.log("listing at 4000");
});
