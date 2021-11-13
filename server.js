const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {origin: "http://localhost:3000", methods: ["GET", "POST"]}
});
const {v4 : uuidV4} = require('uuid');  // Using method v4 as uuidV4
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db')
connectDB();

app.use(cors());
app.use('/files/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    console.log("Server reached");
    res.json({msg: "hello world"});
});
app.use('/file', require('./routes/upload'))

// app.get('/:roomId', (req, res) => {
//     // res.render('room', {roomId: req.params.roomId});
// });

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file?.fieldname + '-' + Date.now() + '.txt');
//     },
// });
// const upload = multer({ storage: storage });

// let files = [];


io.on('connection', socket => {
   socket.on('join-room', (roomId, userId) => {
       socket.join(roomId);
       socket.broadcast.to(roomId).emit('user-connected', userId);
       console.log("Server pe user aya h", userId);

       socket.on('file-uploaded', filename => {
           console.log("File uploaded called", filename);
           socket.broadcast.to(roomId).emit('file-received', filename);
       });

       socket.on('request-location', () => {
           console.log("Loc dedo bhaiya");
           socket.broadcast.to(roomId).emit('fetch-location');
       });

       socket.on('sending-location', (userLoc) => {
           console.log("Loc lelo bhaiya", userLoc);
           socket.broadcast.to(roomId).emit('receive-location', userLoc);
       });

       socket.on('disconnect', () => {  // called when someone leaves the room
           // console.log("server se user disconected", userId);
           socket.broadcast.to(roomId).emit('user-disconnected', userId);
       });
   });
});
server.listen(process.env.PORT || 4200, () => console.log("Server running on 4200"));
