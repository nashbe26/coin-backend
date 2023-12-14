let onlineUser = [];

function joinRoom(socket, io) {
  socket.on("newUser", (data) => {
    console.log(data);

    if (data) {
      let userId = data;

      let userExsit = onlineUser.find((x) => x.userId == userId);

      if (!userExsit) {
        let arrayTab = [];
        arrayTab.push(socket.id);
        console.log(userId);
        onlineUser.push({ userId, userSocket: arrayTab });
      } else {
        userExsit.userSocket.push(socket.id);
      }
    }
    console.log(onlineUser, "onlineUser onlineUser onlineUser");
    io.emit("onlineuser", onlineUser);
  });
}

function joinChat(socket, io) {
  socket.on("join-chat", (disId) => {
    socket.join(disId);

  });
}

function joinNotification(socket, io) {
  socket.on("join-notifs", (my_id) => {
    socket.join(my_id);
    console.log("user join notifs" + my_id);
    console.log(socket.rooms);
  });
}

function leaveChat(socket, io) {
  socket.on("leaveRoom", (roomName) => {
    socket.leave(roomName);
    console.log(`User left room: ${roomName}`);
  });
}

function notification_user(socket, io) {
  socket.on("newnotif", async (data) => {
    const resData = data.notification.email;
    let arrF = onlineUser.find((user) => {
      return user.userId == resData;
    });

    if (arrF)
      arrF.userSocket.map((x) => {
        io.to(x).emit("getNotfi", { data: data.notification });
      });
  });
}

function sendMessage(socket, io) {
  socket.on("sendMessage", ({ discussion_id, user_id, text, sender, seen }) => {
    console.log(discussion_id, user_id, text);
    io.to(discussion_id).emit("message", { user_id, discussion_id, text, sender, seen });

    let arrF = onlineUser.find((user) => {
      return user.userId == user_id;
    });


    if (arrF)
      arrF.userSocket.map((x) => {
        io.to(x).emit("newNotifMessage", { user_id, text, discussion: discussion_id });
      });

  });
}

function sendNotification(socket, io) {

  socket.on("sendNotification", ({notification}) => {
    let arrF = onlineUser.find((user) => {
      return user.userId == notification.id_receiver;
    });

    console.log("fawzi lawzi",arrF);
    
    if (arrF)
      arrF.userSocket.map((x) => {
    console.log(x);
        io.to(x).emit("notification", notification);
      });
  });

}

module.exports = {
  joinRoom,
  notification_user,
  sendMessage,
  joinChat,
  leaveChat,
  joinNotification,
  sendNotification,
};
