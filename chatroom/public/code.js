(function(){

    const app = document.querySelector(".app");
    const socket = io();

    let uname;
    let id;

    app.querySelector(".join-screen #join-user").addEventListener('click', function(){
        let username  = app.querySelector(".join-screen #username").value;
        let server = app.querySelector(".join-screen #serverId").value;
        if(username.length == 0 || server.length == 0){ return; }
        socket.emit("newuser", username, server);
        uname = username;
        id = server;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });
    app.querySelector(".join-screen").addEventListener('keydown', function(event){
        if(event.key == "Enter"){
            let username  = app.querySelector(".join-screen #username").value;
            let server = app.querySelector(".join-screen #serverId").value;
            if(username.length == 0 || server.length == 0){ return; }
            socket.emit("newuser", username, server);
            uname = username;
            id = server;
            app.querySelector(".join-screen").classList.remove("active");
            app.querySelector(".chat-screen").classList.add("active");
        }
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length == 0){ return; }
        renderMessage("my", {
            username: uname,
            serverId: id,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            serverId: id,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });
    app.querySelector(".chat-screen").addEventListener("keydown", function(event){
        if(event.key == 'Enter'){
            let message = app.querySelector(".chat-screen #message-input").value;
            if(message.length == 0){ return; }
            renderMessage("my", {
                username: uname,
                serverId: id,
                text: message
            });
            socket.emit("chat", {
                username: uname,
                serverId: id,
                text: message
            });
            app.querySelector(".chat-screen #message-input").value = "";
        }
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("exituser", uname, id);
        window.location.href = window.location.href;
    });

    let onScreen = true;
    document.onvisibilitychange = () => {
        if(document.hidden){
            onScreen = false;
        }else{
            onScreen = true;
        }
    }

    function disconect(){
        return {username:uname, id:id};
    }

    socket.on("update", function(update){
        renderMessage("update", update);
    });

    socket.on("chat", function(message){
        renderMessage("other", message);
    });

    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my"){
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        }else if(type == "other" && message.serverId == id){
            if(!onScreen){ alert('New Message'); }
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        }else if(type == "update" && message.serverId == id){
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message.text;
            messageContainer.appendChild(el);
        }
        // scroll chat to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

})();