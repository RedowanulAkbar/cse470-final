const express = require("express");
const cors = require("cors");
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
const PORT = process.env.PORT || 8080;
//mongodb connection
console.log(process.env.MONGODB_URL);
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to database"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//
const userModel = mongoose.model("user", userSchema);
//contact schema

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const Contact = mongoose.model('Contact', contactSchema);

//api for contact

app.post('/contact', (req, res) => {
  const contact = new Contact(req.body);
  contact.save()
    .then(() => res.sendStatus(200))
    .catch((err) => res.status(400).json(err));
});

//api
app.get("/", (req, res) => {
  res.send("Server is running");
});
//sign up
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const result = await userModel.findOne({ email: email }).exec();
    console.log(result);
    if (result) {
      res.send({ message: "Email id is already register", alert: false });
    } else {
      const data = userModel(req.body);
      await data.save();
      res.send({ message: "Successfully sign up", alert: true });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Error occurred while signing up", alert: false });
  }
});
//api login
app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    const result = await userModel.findOne({ email: email });
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({ message: "login is successful", alert: true, data: dataSend });
    } else {
      res.send({ message: "user not found", alert: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "internal server error", alert: true });
  }
});

//product api

const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product", schemaProduct);


//add product in database api
app.post("/uploadProduct",async(req,res)=>{
  console.log(req.body)
  const data = await productModel(req.body)
  const datasave = await data.save()
  console.log(datasave)
  res.send({message : "Upload successfully"})
})

//
app.get("/product",async(req,res)=>{
const data = await productModel.find({})
res.send(JSON.stringify(data))
})
//cart schema

const cartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  qty: { type: Number, required: true },
  total: { type: Number, required: true },
  price: { type: Number, required: true }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);


app.post('/cart', async (req, res) => {
  try {
    // Parse the cart items from the request body
    const cartItems = req.body;

    // Insert the cart items into the MongoDB collection using Mongoose
    const result = await CartItem.insertMany(cartItems);

    // Return a success response to the client
    res.status(200).json({ message: 'Cart items inserted successfully.' });
  } catch (err) {
    // Handle any errors and return a failure response to the client
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;

module.exports = CartItem;
//server run
app.listen(PORT, () => console.log("server is running at port :" + PORT));
