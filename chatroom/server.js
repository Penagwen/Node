const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io  = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection", function(socket){
    socket.on("newuser", function(username, id){
        socket.broadcast.emit("update", {text:username + " joined the conversation", serverId: id});
    });
    socket.on("exituser", function(username, id){
        socket.broadcast.emit("update", {text:username + " left the conversation", serverId: id});
    });
    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });
});

server.listen(5000, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 5000);
});