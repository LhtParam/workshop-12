const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const User = require("./userModels.js");

const db = mongoose.connect(
    "mongodb+srv://param:uOGuKEbjmxC5RW2Y@cluster0.p4vs5.mongodb.net/users?retryWrites=true&w=majority",
    (err, db) => {
      if (err) {
        console.log(err);
      }
      console.log("mongoose connected");
    }
  );

  app.get("/", (req, res) => {
    res.send("Successful");
  });

  app.get("/users",  (req, res) => {
    const { users = false, page = 1, limit = 5, keys = false } = req.query;
    const search = req.query.search;
    const sendUsers = User.find();
    // console.log(sendUsers);
    const searchResult =  User.find({
      name: { $regex: RegExp("^" + search + ".*", "i") },
    }).exec();
  
    limitedUsers =  sendUsers.limit(limit * 1).skip((page - 1) * limit);
    obj = limitedUsers[0];
  
    allKeys = [];
    for (i in obj) {
      allKeys.push(i);
    }
  
    try {
      if (users) {
        res.status(200).json({ Total: limitedUsers.length, limitedUsers });
      }
      if (search !== undefined) {
        res
          .status(200)
          .json({ Total: searchResult.length, "Search Results": searchResult });
      }
      if (keys) {
        res.status(200).json({ "All Keys": allKeys });
      }
      if (!users && search === undefined && !keys) {
        res.sendStatus(404);
      }
    } catch (err) {
      console.log(err);
    }
  });


app.listen(3000, console.log("Server started"));