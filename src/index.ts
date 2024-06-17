import express from "express";
import path from "path"

const app = express();
const port = 8000;

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, 'template/page'))

app.get("/", function(req, res) {
    res.render("index")
})

app.listen(port, function() {
    console.log("runned")
})