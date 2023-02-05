const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
require("dotenv").config();

console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());
app.use(cors());
app.options("*", cors());

const subscribersRouter = require("./routes/subscribers");
const usersRouter = require("./routes/user");
const ordersRouter = require("./routes/order");
const postsRouter = require("./routes/posts");
const proposalsRouter = require("./routes/proposal");
const requestsRouter = require("./routes/request");
const feedbackRouter = require("./routes/feedback");

app.use("/subscribers", subscribersRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/posts", postsRouter);
app.use("/proposals", proposalsRouter);
app.use("/requests", requestsRouter);
app.use("/feedback", feedbackRouter);
app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));
app.get("/style.css", function (req, res) {
  res.sendFile(__dirname + "/" + "style.css");
});
// app.use(express.static(__dirname));
// app.get("/", function root(req, res) {
//   res.sendFile(__dirname + "/index.html");
// });

const port = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server Started ${port}`)
);
