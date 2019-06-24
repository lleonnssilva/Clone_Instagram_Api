const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
const dotenv = require("dotenv");

const server = require("http").Server(app);
const io = require("socket.io")(server);
dotenv.config();

mongoose.connect(process.env.StrConexaoLocal, { useNewUrlParser: true });

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "uploads", "resized"))
);
app.use(cors());
app.use(require("./routes"));

server.listen(3333);
