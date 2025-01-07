const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// meddleware :-
app.use(cors());

app.use(express.json());

//connnect to the database:-
mongoose
  .connect(
    "mongodb+srv://nitinacewebx:nitinacewebx2025@cluster0.qral2.mongodb.net/"
  )
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((e) => {
    console.log("Database not connected :: " + e);
  });

// Schema for adding chat :-
const ChatSchema = new mongoose.Schema({
  text: String,
  senderId: Number,
  date: { type: Date, default: Date.now },
});

// Schema for adding users :-
const UsersSchema = new mongoose.Schema({
  email: String,
  id: Number,
  date: { type: Date, default: Date.now },
});

const AuthSchema = new mongoose.Schema({
  email: String,
  id: Number,
  password: String,
  image: String,
  date: { type: Date, default: Date.now },
});
// create chat modal :)
const Chat = mongoose.model("Chat", ChatSchema);
const Users = mongoose.model("Users", UsersSchema);
const AuthUser = mongoose.model("AuthUser", AuthSchema);
// post request for user adding : )
app.post("/add/user", async (req, res) => {
  try {
    const { email, id } = req.body;
    const newUser = await Users.create({ email, id });
    res.status(200).json({
      data: newUser,
      message: "User added successfully",
    });
  } catch (error) {
    console.log("error creating user", error);
  }
});

// Geting users :)
app.get("/users", async (req, res) => {
  try {
    const AllUser = await Users.find({});
    res.status(200).json({
      data: AllUser,
      message: "All User display successfully",
    });
  } catch (error) {
    console.log("error creating user", error);
  }
});

//adding chat:---
app.post("/add", async (req, res) => {
  // console.log("req::::", req);
  try {
    const { text, senderId } = req.body;

    if (!text || !senderId) {
      return res
        .status(400)
        .json({ message: "text and senderId are required" });
    }

    const newChat = await Chat.create({ text, senderId });
    res.status(200).json({
      data: newChat,
      message: "Chat added successfully",
    });
    console.log("newChat", newChat);
  } catch (error) {
    console.error("Error adding chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// chat get :-----
app.get("/allchat", async (req, res) => {
  try {
    const allchat = await Chat.find();

    res.status(200).json({
      message: "All chat successfully",
      data: allchat,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log("error getting all chat", error);
  }
});

app.get("/chat", async (req, res) => {
  const { senderId, receiverId } = req.body;
  // console.log("chat", senderId, receiverId);
  try {
    const chat = await Chat.find({ senderId: { $in: [senderId, receiverId] } });
    // console.log("chat", chat);
    res.status(200).json({
      message: "All chat successfully",
      data: chat,
    });
  } catch (error) {
    console.log("Error:->", error);
    res.status(400).json({
      message: "something went wrong!",
    });
  }
});

//AUth users:-
//add:-
app.post("/register", async (req, res) => {
  try {
    const { email, password, id, image } = req.body;
    const register = await AuthUser.create({ email, password, id, image });
    res.status(200).json({
      message: "user register succes",
      data: register,
    });
    console.log("register succes", register);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log("error adding user:", error);
  }
});

// getall:)
app.get("/all/register", async (req, res) => {
  try {
    const allRegister = await AuthUser.find({});
    res.status(200).json({
      message: "All user succes",
      data: allRegister,
    });
    console.log("All register succes", allRegister);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log("error adding user:", error);
  }
});

const getAllChat = async () => {
  try {
    const allData = await Chat.find();
    return allData;
  } catch (error) {
    console.log("error getting all chat", error);
  }
};
app.listen("5000", (req, res) => {
  console.log("api post listen", "http://localhost:5000");
});

module.exports = getAllChat;
