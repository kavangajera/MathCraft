const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config()
const userRoutes = require("./routes/users-routes");
const questionRoutes = require('./routes/questions-routes')
const answerRoutes = require('./routes/answers-routes')
const commentRoutes = require('./routes/comments-routes')
const HttpError = require("./models/http-error");
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const {Server} = require('socket.io');
const {createServer} = require('http')
const bodyParser = require('body-parser');
//Sockets

const server = createServer(app);
const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"],
    credentials:true
  }
});
io.on("connection",(socket)=>{
  console.log("User connected !")
  console.log("Id: ",socket.id);
})



// Socket ends


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // your React app's URL
  credentials: true // Allow cookies to be sent
}));
app.use("/api/user", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answer/", answerRoutes);
app.use("/api/comment/",commentRoutes);

app.get('/test-cookies', (req, res) => {
  console.log('Cookies:', req.cookies);  // Check if cookies are being parsed
  res.json({ cookies: req.cookies });
});

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

//You can replace local server uri with MongoDB Atlas connection link
mongoose
  .connect(
     process.env.MONGO_URI
  )
  .then(() => {
    console.log("Running at localhost://5000")
    server.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

  
