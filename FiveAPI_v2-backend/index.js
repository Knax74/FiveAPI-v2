const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});


const validAPIKey = "ChangeMe";

io.use((socket, next) => {
    const apiKey = socket.handshake.auth.token;
    if (apiKey === validAPIKey) {
      return next();
    } else {
      return next(new Error("Authentication error: Invalid API Key"));
    }
});

io.on("connection", (socket) => {
    console.log("Connected to Server:", socket.id);

    socket.on("server-ping", () => {
        socket.emit("server-ping", { valid: true });
    });


    // Test Event
    socket.on("PlayerKicked", (data) => {
        console.log("Player Kicked:", data);
    });

    socket.emit("KickPlayer", {
        id: 1,
        reason: "test",
    });
    // END

    socket.on("disconnect", () => {
        console.log("❌ Disconnected:", socket.id);
    });
});

httpServer.listen(4000, () => {
    console.log("Server started on port 4000");
});