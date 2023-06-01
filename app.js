require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const homeStartingContent = "Express Yourself. Connect with Others. Share Your Stories.";
const aboutContent = "Welcome to Reading Journal, a revolutionary platform designed to empower individuals to share their stories, experiences, and passions with the world. We believe that everyone has a unique voice that deserves to be heard, and we're here to provide the tools and support to make that happen.";
const contactContent = "At Reading Journal, we value your feedback, questions, and suggestions. We strive to provide you with the best possible experience on our platform. If you have any inquiries or need assistance, please don't hesitate to reach out to us.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

main().catch((err) => console.log(err));
async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qj0tyeo.mongodb.net/blogDB`, {useNewUrlParser: true,});
  console.log("Connected to the database");
}

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req,res){

 
  res.render("home",{homeStartingContent: homeStartingContent});

 
});

app.get("/blog", function(req, res){
  Post.find({}, function(err, posts){
    res.render("blog",{ posts: posts});
   });
})

app.get("/about", function(req,res){
 res.render("about",{aboutContent});
});

app.get("/contact", function(req,res){
  res.render("contact",{contactContent});
});

app.get("/compose", function(req,res){
  res.render("compose");
});

app.post("/compose", function(req,res){
const post = new Post({
  title: req.body.postTitle,
  content: req.body.postBody
});

post.save(function(err){

  if (!err){

    res.redirect("/");

  }

});


 
});

app.get("/posts/:postId", function(req,res){
 const requestedPostId = req.params.postId;
 Post.findOne({_id: requestedPostId}, function(err, post){

  res.render("post", {

    title: post.title,
    content: post.content

  });

 });


});











app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
