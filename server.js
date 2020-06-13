"use strict";
const express = require("express");
const morgan = require("morgan");
const { users } = require("./data/users");
let currentUser = {};
const app = express();
// declare the hp in a function
const handleSignIn = (req, res) => {
  res.render("pages/signIn", {
    title: "Welcome to Facespace",
    currentUser: currentUser,
  });
};
const handleName = (req, res) => {
  const firstName = req.query.firstName;
  console.log(firstName);
  const user = users.find((user) => user.name === firstName);
  if (!user) {
    return res.redirect("/signin");
  }
  currentUser = user;
  return res.redirect(`/home/users/${user._id}`);
};
const handleHomepage = (req, res) => {
  console.log(currentUser);
  res.render("pages/homepage", {
    title: "Welcome to Facespace ",
    users: users,
    currentUser: currentUser,
  });
};
// declare the 404 in a function
const handleFourOhFour = (req, res) => {
  res.status(404).render("pages/signIn");
};
const handleProfilePage = (req, res, next) => {
  console.log(currentUser);
  const isTheUserFromParams = (user) => user._id === req.params._id;
  const user = users.find(isTheUserFromParams);
  if (user) {
    user.friends = user.friends.map((friend) => {
      return users.find((user) => {
        return user._id === friend || user._id === friend._id;
      });
    });
    res.render("pages/profile", {
      title: "User Profile",
      user: user,
      currentUser: currentUser,
    });
    return;
    //so that it stops at the above step we return it
  }
  next();
};
// -----------------------------------------------------
// server endpoints
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
// endpoints
app.get("/home", handleHomepage);
app.get("/home/users/:_id", handleProfilePage, handleFourOhFour);
// a catchall endpoint that will send the 404 message.
app.get("/signin", handleSignIn);
app.get("/getname", handleName);
app.get("*", handleFourOhFour);
app.listen(8000, () => console.log("Listening on port 8000"));
