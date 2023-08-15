const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const User = require("./models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "ifweyg32ygyfv873bugsvf82vfegvwed2";

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

mongoose.connect("mongodb://localhost:27017/booking-app");

// const connectDB = async () => {
//   await mongoose
//     .connect('mongodb+srv://ursvedantyetekar:RbC4g1LnUE4MIpNR@cluster0.gunksbu.mongodb.net/?retryWrites=true&w=majority')
//     .then(() => {
//       console.log("Database connection successful.");
//     })
//     .catch((error) => console.log(error.message));
// };
// TEST GET
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

// app.post('/register', async (req, res) => {
//   const {firstName, lastName, email, password} = req.body;

//   const userDoc = await User.create({
//     firstName,
//     lastName,
//     email,
//     password:bcrypt.hashSync(password, bcryptSalt),
//   });

//   res.json(userDoc);
// })

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
  } catch (e) {}
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

app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});

// connectDB();
app.listen(4000, () => {
  console.log("listing at 4000");
});
