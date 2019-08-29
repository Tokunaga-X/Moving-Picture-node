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
          status: "danger",
          msg: "Em, no file selected!"
        });
      } else {
        res.render("owner", {
          status: "success",
          msg: "File Uploaded!",
          msg2: "Here is what u uploaded:",
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

// Port & Listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
