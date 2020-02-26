const express = require('express');
const helmet = require("helmet");
const cors = require("cors");

const session = require("express-session"); // npm i express-session
const KnexStore = require("connect-session-knex")(session); 


const apiRouter = require('./api-router.js');
const authRouter = require('../auth/auth-router');
const restricted = require('../auth/restricted-middleware')
const userRouter = require('../users/users-router');
const configureMiddleware = require('./configure-middleware.js');

const knex = require("../database/dbConfig");

const server = express();

const sessionConfig = {
    name: "super secret cookiemonster",
    secret: "keep it secret, keep it safe!",
    resave: false,
    saveUninitialized: true, // related to GDPR compliance
    cookie: {
      maxAge: 1000 * 60 * 10,
      secure: false, // should be true in production
      httpOnly: true, // tr ue means JS can't touch the cookie
    },
    // remember the new keyword
    store: new KnexStore({
      knex,
      tablename: "sessions",
      createtable: true,
      sidfieldname: "sid",
      clearInterval: 1000 * 60 * 15,
    }),
  };

configureMiddleware(server);

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig))

server.use('/api', apiRouter);
server.use('/auth', authRouter)
server.use('/users', restricted, userRouter)

server.get("/", (req, res) => {
    // console.log(req.session);
    res.json({ api: "up" });
  });

module.exports = server;
