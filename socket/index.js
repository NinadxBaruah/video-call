const { WebSocketServer, WebSocket } = require("ws");



const {
  setvideoChatRoom,
  getvideoChatRoom,
  hasVideoChatRoom,
  videoChatRoom,
} = require("../utils/videoChatRoom");


function onSocketPreError(e) {
  console.log("Socket Pre Error", e);
}
function onSocketPostError(e) {
  console.log("Socket Post Error:", e);
}

module.exports = function configure(server) {
  const wss = new WebSocketServer({ noServer: true });
  // this will triggered when http server try to upgrade the
  //conneciton to WebSocket, we can do auth here also distroy the socket if needed

  // Set up an interval outside the connection handler to send pings to all users
  setInterval(() => {
    // Iterate over all connected users in videoChatRoom and send ping messages
    for (const [userId, ws] of videoChatRoom.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      }
    }
  }, 30000); // Send ping every 30 seconds
  server.on("upgrade", (req, socket, head) => {
    socket.on("error", onSocketPreError);
    const urlParts = req.url.split("/");
    if (urlParts[1] == "multiplayer") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener("error", onSocketPreError);
        wss.emit("connection", ws, req);
      });
    } else if (urlParts[1] == "video-chat") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener("error", onSocketPreError);
        wss.emit("connection", ws, req);
      });
    } else if (urlParts[1] == "send-message") {
      const authToken = req.headers["sec-websocket-protocol"];
      jwt.verify(authToken, process.env.jwt_secret, (err, user) => {
        if (err) {
          console.log("JWT verification failed:", err);
          socket.destroy();
          return;
        }

        req.user = user.userId;

        wss.handleUpgrade(req, socket, head, (ws) => {
          socket.removeListener("error", onSocketPreError);
          wss.emit("connection", ws, req);
        });
      });
    }
  });

  wss.on("connection", (ws, req) => {
    // console.log("client connected");
    ws.on("error", onSocketPostError);
    const urlParts = req.url.split("/");
    const roomId = urlParts[3];
 if (urlParts[1] == "video-chat") {
      let user_id;
      ws.on("message", (data) => {
        try {
          const dataToString = data.toString();
          const message = JSON.parse(dataToString);
          // console.log(message)

          if (message.type == "setUser") {
            user_id = message.user_id;
            // ws.iceCandidates = [];
            // ws.SDPoffer = [];
            setvideoChatRoom(user_id, ws);
          }

          if (message.type == "call") {
            const caller_id = message.callerId;
            const user_id = message.user_id;
            if (!hasVideoChatRoom(caller_id)) {
              ws.send(JSON.stringify({ type: "calling-user-not-found" }));
            } else {
              const callingClient = getvideoChatRoom(caller_id);
              const initiateCallClient = getvideoChatRoom(user_id);
              initiateCallClient.send(
                JSON.stringify({ type: "initiate-call" })
              );
              callingClient.send(
                JSON.stringify({ type: "incoming-call", caller_id: user_id })
              );
            }
          }

          if (message.type == "rejectCall") {
            const caller_id = message.caller_id;
            const client = getvideoChatRoom(caller_id);
            client.send(JSON.stringify({ type: "call-rejected" }));
          }

          if (message.type == "requesting-sdp") {
            const caller_id = message.caller_id;
            const user_id = message.user_id;
            const client = getvideoChatRoom(caller_id);
            // console.log("in requesting sdp", caller_id);
            client.send(
              JSON.stringify({
                type: "requesting-sdp",
                caller_id: caller_id,
                user_id: user_id,
              })
            );
          }

          if (message.type == "offer") {
            const caller_id = message.caller_id;
            const user_id = message.user_id;
            const client = getvideoChatRoom(caller_id);
            const offer = message.offer;
            client.send(
              JSON.stringify({
                type: "remoteOffer",
                remoteOffer: offer,
                caller_id: caller_id,
              })
            );
          }

          if (message.type == "answer") {
            const caller_id = message.caller_id;
            const answer = message.answer;
            const client = getvideoChatRoom(caller_id);
            client.send(
              JSON.stringify({ type: "remoteAnswer", remoteAnswer: answer })
            );
          }

          if (message.type == "candidate") {
            const caller_id = message.caller_id;
            if (caller_id) {
              const candidate = message.candidate;
              const client = getvideoChatRoom(caller_id);
              client.send(
                JSON.stringify({ type: "candidate", candidate: candidate })
              );
            }
          }

          if (message.type == "stop:call") {
            const caller_id = message.callerId;
            console.log(caller_id);
            if (caller_id) {
              const client = getvideoChatRoom(caller_id);

              if(client)client.send(JSON.stringify({ type: "stop:call" }));
            }
          }
        } catch (error) {
          console.log("error from the video-chat on message: ", error);
        }
      });

      ws.on("close", () => {
        videoChatRoom.delete(user_id);
      });
    }
  });
};
