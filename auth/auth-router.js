const bcrypt = require("bcryptjs"); // <<<<<<<<<<<<<<<< npm i bcryptjs
const router = require("express").Router();

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8); // << 1

  user.password = hash; // <<<<<<<<<<<<<<<<<<<<<<<<<<<< 2

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.loggedIn = true;
          req.session.username = user.username;
  
          res.status(200).json({
            message: `Welcome ${user.username}!`,
          });
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

router.get("/logout", (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.status(500).json({
            you: "can check out any time you like, but you can never leave",
          });
        } else {
          res.status(200).json({ you: "logged out successfully" });
        }
      });
    } else {
      res.status(200).json({ bye: "felicia" });
    }
  });

module.exports = router;
