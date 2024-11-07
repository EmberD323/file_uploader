/////// app.js

const path = require("node:path");
require("dotenv").config();

const express = require("express");

const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('@prisma/client')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = new PrismaClient()
const indexRouter = require("./routes/indexRouter");


const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({
  cookie: {
   maxAge: 7 * 24 * 60 * 60 * 1000 // ms
  },
  secret: 'a santa at nasa',
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(
    new PrismaClient(),
    {
      checkPeriod: 2 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));


//setting up the LocalStrategy
passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            username: username,
          },
        })
  
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
  );

//sessions and serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
  try {
    
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })

    done(null, user);
  } catch(err) {
    done(err);
  }
});


  //current user set local

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);



  

app.listen(3000, () => console.log("app listening on port 3000!"));
