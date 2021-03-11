require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var expressLayouts = require("express-ejs-layouts");

var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var bodyParser = require("body-parser");
var flash = require("req-flash");
var oldInput = require("old-input");

var port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");

var User = require("./models/User");
var Agenda = require("./models/Agenda");
var AgendaJoin = require("./models/AgendaJoin");
var LiveQuestions = require("./models/LiveQuestion");

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(oldInput);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(expressLayouts);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.locals.user = req.session.user_data;
  res.locals.active = req.session.active;
  next();
});
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
require("./config/database");

require("./routes/router")(app);

app.get("/api/liveQuestion", async (req, res) => {
  try {
    console.log("live question req.query===============", req.query);
    let questionData = await LiveQuestions.find({
      agenda: req.query.agendaId,
    }).populate("userData");
    res.send({
      status: 200,
      message: "data fetched",
      data: questionData,
    });
  } catch (error) {
    console.log("error.message=========>", error.message);
    res.send({
      status: 400,
      message: error.message,
      data: questionData,
    });
  }
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

let server = app.listen(port, () => {
  console.log("Port : 5000");
});
app.set("layout", "layouts/layout");

// global.io = require("socket.io")(
//   server, {
//   serveClient: false,
//   // below are engine.IO options
//   origins: "*:*",
//   // transports: ["polling"],
//   pingInterval: 10000,
//   transports: ['websocket',"polling"],
//   upgrade: false,
//   pingTimeout: 11000,
//   cookie: false,
//   }
// );

// io
// .use(function (socket, next) {
//   if (socket.handshake.query && socket.handshake.query.token) {
//     // console.log("token--------", socket.handshake.query.token.split(" ")[1]);

//     jwt.verify(
//       socket.handshake.query.token.split(" ")[1],
//       "vnrvjrekrke",
//       function (err, decoded) {
//         if (err) {
//           console.log("error-------1-", err);
//           return next(new Error("Authentication error"));
//         }
//         socket.decoded = decoded;
//       }
//     );
//     next();
//   } else {
//     next(new Error("Authentication error"));
//   }
// })
// .on("connection", async (socket) => {
//   console.log("a user connected------------------------------>", socket.id);

  // const updateSocketId = await User.findOneAndUpdate(
  //   { token: socket.handshake.query.token.split(" ")[1] },
  //   { socketId: socket.id },
  //   { new: true }
  // );

  // socket.on("ping", async (data, cb) => {
  //   socket.emit("pong", data);
  // });

  // socket.on("disconnect", function () {
  //   console.log("disconnect fired!");
  // });

  // socket.on("reconnect", function () {
  //   console.log("reconnect fired!");
  // });
  
  // socket.on("sendNotification", async (data, cb) => {
  //   console.log("sendNotification=========> ", data);
  //   socket.emit("newNotification","data")
  // });

  // setInterval(() => {
  //   socket.emit("newNotification","data=========")
  // }, 5000);

// });

module.exports = app;
