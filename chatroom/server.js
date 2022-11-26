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
    socket.on('disconnect', function(){
        let message = disconect();
        socket.broadcast.emit("update", {text:message.username + " left the conversation", serverId: message.id});
    });
});


const port = 4856;
server.listen(4856, '0.0.0.0', function() {
    console.log('Listening to port:  ' + port + ' go to 10.0.0.52:' + port);
});