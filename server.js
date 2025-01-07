const express = require("express");
const getAllChat = require("./users");
const cors = require("cors");

const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:3000", // Ensure no extra spaces
  },
});
const app = express();
// meddleware :-
app.use(cors());

app.use(express.json());
console.log("Server running on http://localhost:8080");

//Socket section Start :----------------------------------------------------------------------------------------->>>>
let users = [];

const allMessages = getAllChat();

// Add user in array :
const addUsers = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  console.log("users", users);
};
// Remove user from array after disconnect :
const removeUsers = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
// Filter user for chat :
const getUser = (received) => {
  return users?.find((user) => user.userId === received?.userId);
};
// When user get connect :
io.on("connection", (socket) => {
  console.log("A user connected!");
  io.emit("welcome", "hello this message from the server!");
  socket.on("addUser", (userid) => {
    addUsers(userid, socket.id);
    io.emit("getUsers", users);
  });
  // Send and Get Message :
  socket.on("sendMessage", ({ senderId, receiverId, text, withchatId }) => {
    const user = getUser(receiverId);
    console.log("server user--------->>>", user);
    console.log("withchat", withchatId);
    if (user?.userId === withchatId)
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
        withchatId,
      });
  });
  // When user get connect
  socket.on("disconnect", () => {
    console.log("a user disconnect");
    removeUsers(socket.id);
    io.emit("getUsers", users);
  });
});
//Socket section End :----------------------------------------------------------------------------------------->>>>
