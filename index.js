const express = require('express')
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser")
const path = require("path")
const https = require("https")
const fs = require("fs")
const app = express()

app.use(express.static(path.join(__dirname + "/public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}));
app.use((req,res,next) => req.protocol !== "https" ? res.status(404).json({error : "Unsupprted protocol" , code : 404}) : next())
app.get("/index.html" , (req,res) => res.sendFile(path.join(__dirname + "/public/views/index.html")))
app.post("/thank.html" , (req,res) => {
  let html = fs.readFileSync(path.join(__dirname + "/public/views/thank.html"),"utf-8")
  fs.writeFileSync(path.join(__dirname + "/public/views/thank.html"),html.replace("ash@loremcompany.com.",req.body.email + "."),"utf-8")
  res.sendFile(path.join(__dirname + "/public/views/thank.html"))
})

app.use((req,res,next) => res.redirect("/index.html"))
const server = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname + "/cert/private.key"),"utf8"),
      cert: fs.readFileSync(path.join(__dirname +"/cert/certificate.crt"),"utf8")
    },
    app
);

server.listen(process.env.PORT)
