const express = require("express");
const path = require("path");
const logger = require("./middleware/logger");
const expressLayouts = require("express-ejs-layouts");
const multer = require("multer");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

// Passport config
require("./config/passport")(passport);

// DB config
const db = require("./config/keys").MongoURL;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(logger);
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Public Folder
app.use(express.static(path.join(__dirname, "public")));

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Set Storage Engine
const storage = multer.diskStorage({
  destination: "./public/upload/",
  filename: function(req, file, cb) {
    cb(
      null,
      path.basename(file.originalname, path.extname(file.originalname)) +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  }
});

// Init Upload
const upload = multer({
  storage: storage
}).single("myImage");

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("owner", {
        status: "danger",
        msg: err
      });
    } else {
      console.log(req.file);
      if (req.file == undefined) {
        res.render("owner", {
          status: "danger"
        });
      } else {
        res.render("owner", {
          status: "success",
          file: `upload/${req.file.filename}`
        });
      }
    }
  });
});

// Router
app.use("/", require("./route/intro"));
app.use("/users", require("./route/users"));
app.use("/api/picture", require("./route/api/picture"));

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  //这段仅仅为了方便返回json而已
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == "OPTIONS") {
    //让options请求快速返回
    res.sendStatus(200);
  } else {
    next();
  }
});

// Port & Listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
