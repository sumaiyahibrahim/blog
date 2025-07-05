import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Setting EJS as the templating engine
app.set("view engine", "ejs");

// Middleware to serve static files and parse form data
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory array to store posts (no DB)
const posts = [];

// Home route: shows all posts
app.get("/", (req, res) => {
    res.render("home", { posts: posts });
});

// Compose route: show form to create a post
app.get("/compose", (req, res) => {
    res.render("compose");
});

// Handle POST request from compose form
app.post("/compose", (req, res) => {
    const post = {
        title: req.body.postTitle,
        content: req.body.postBody,
    };
    posts.push(post);
    res.redirect("/");
});

// Dynamic route for individual posts
app.get("/posts/:title", (req, res) => {
    const requestedTitle = req.params.title.toLowerCase();

    const foundPost = posts.find(
        (post) => post.title.toLowerCase() === requestedTitle
    );

    if (foundPost) {
        res.render("post", { title: foundPost.title, content: foundPost.content });
    } else {
        res.send("Post not found");
    }
});

app.listen(port, () => {
    console.log(`Blog app running at ${port}`);
});
