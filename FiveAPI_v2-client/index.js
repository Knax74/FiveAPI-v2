const { io } = require("socket.io-client");
const Config = require("./config.websocket.js");
const socket = io(Config.ServerURL, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 10000,
    timeout: 2000,
    transports: ["websocket"],
    auth: {
        token: Config.APIKey
    }
});

socket.on("connect", () => {
    console.log("^8<FIVEAPI>^0 Connecting to Websocket...");
    socket.emit("server-ping");
});

socket.on("server-ping", (data) => {
    if (data.valid) {
        console.log("^8<FIVEAPI>^0 Connected to Websocket.");
    } else {
        console.log("^8<FIVEAPI>^0 Failed to connect to Websocket.");
        socket.disconnect();
    }
});

const Debug = (msg) => {
    if (Config.Debug) {
        console.log("^6(DEBUG)^0 ^8<FIVEAPI>^0 " + msg);
    }
}

socket.on("KickPlayer", (data) => {
    const { id, reason } = data;
    if (GetPlayerName(id) > 0) {
        DropPlayer(id, reason);
        Debug("Kicked Player: " + GetPlayerName(id)) + "( " + id + " ) | Reason: " + reason;
        socket.emit("PlayerKicked", {
            id: id,
            reason: reason,
            status: "successfully"
        });
    } else {
        Debug("Player not found. ID: " + id);
        socket.emit("PlayerKicked", { status: false, reason: "Player not found." });
    }
});

socket.on("disconnect", () => {
    console.log("^3(!)^0 ^8<FIVEAPI>^0 Connection lost. Reconnecting...");
});

socket.on("connect_error", (err) => {
    if (err.message == "xhr poll error") {
        console.log("^1(!)^0 ^8<FIVEAPI>^0 Websocket is unavailable.");
    } else {
        console.log("^1(!)^0 ^8<FIVEAPI>^0 Connection error: " + err.message);
    }
});

socket.on("reconnect", (attempt) => {
    console.log(`^8<FIVEAPI>^0 Reconnected to Websocket. Attempt: ${attempt}`);
});

socket.on("reconnect_failed", () => {
    console.error("^8<FIVEAPI>^0 Failed to reconnect to Websocket.");
});
