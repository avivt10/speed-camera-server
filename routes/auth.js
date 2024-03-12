const { Router } = require("express"); 
const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr"); 
const User = require("../MongoModels/Users");
const router = new Router();
require("dotenv").config();
const cryptr = new Cryptr(process.env.JWT_KEY);


router.post("/register", async (req, res) => {
  const { FirstName, LastName, Phone, Password } = req.body;
  try {
    const exists = await User.findOne({ Phone });
    if (exists) {
      return res.status(400).send("User Exists");
    }
    const encryptedPassword = await cryptr.encrypt(Password) 
    const user = new User({ FirstName, LastName, Phone, Password: encryptedPassword });
    const resp = await user.save();
    const token = await jwt.sign(
      {
        phone: resp.Phone,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1H",
      }
    );
    return res.status(200).json({
      message: "You have successfully registered",
      token: token,
    });
  } catch (err) {
    res.send(err);
  }
});


router.post("/login", async (req, res) => {
  const { Phone, Password } = req.body;

  if(!Password || !Phone) {
    return res.status(400).send("missing parameter");
  }
  try {
    const doc = await User.findOne({ Phone });
    const isEqual = await cryptr.decrypt(doc.Password) === Password; 

    if (doc && isEqual) {
      const token = await jwt.sign(
        {
          phone: doc.Phone,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1H",
        }
      );
      return res.status(200).json({
        message: "Login successful",
        token: token,
        FirstName:doc.FirstName,
      });
    } else {
      throw new Error("User or Password not valid")
    }
  } catch (err) {
    return res.status(401).send("Incorrect username or password! Try again");
  }
});

router.post("/verifyToken", async (req, res) => {
  const { authorization : token } = req.headers;

  try {
    if (token) {
      jwt.verify(token, process.env.JWT_KEY);
      return res.status(200).send("OK");
    } else {
      throw new Error("token is not valid");
    }
  } catch (error) {
    return res.status(400).send("failed");
  }
});

module.exports = router;
