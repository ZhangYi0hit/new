const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");



// Wed Jun 18 2014 



// Get username and room from URL
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const URL =
  "wss://pstwk9y5pj.execute-api.ap-southeast-1.amazonaws.com/production";

let exampleSocket = new WebSocket(URL);
exampleSocket.onopen = function (event) {
  exampleSocket.send(JSON.stringify({ action: "setName", name: username }));
};

exampleSocket.onmessage = function (event) {
  const data = JSON.parse(event.data);

  if (data.setName) {
    systemOut(data.setName.systemMessage);
    outputUsers(data.setName.members);
  } else if (data.publicMessage) {
    outputMessage(data.publicMessage);
  } else if (data.privateMessage) {
    alert(data.privateMessage);
  } else if (data.systemMessage) {
    alert(data.systemMessage);
  }
};
function publicSend() {
  const msg = document.getElementById("msg").value;
  document.getElementById("msg").value == '';

  exampleSocket.send(
    JSON.stringify({
      action: "sendPublic",
      message: msg,
    })
  );
}
//systemMessage
function systemOut(msg){
  const div = document.createElement("div");
  div.classList.add("system");
  const p = document.createElement("p");
  p.innerHTML += `<span>${msg}</span>`;
  div.appendChild(p);
  document.querySelector(".chat-messages").appendChild(div);

}
// Output message to DOM
function outputMessage(message) {
  
  const div = document.createElement("div");

div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username + "  ";
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);

 
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    exampleSocket.send(
      JSON.stringify({
        action: "disconnect",
        name: username
      })
    );
  } else {
  }
});
