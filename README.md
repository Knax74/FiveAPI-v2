# FiveAPI-v2
 Better version of my old project `Knax74/FiveAPI`

 ## Changes:
 1. Using **Websockets** (`socket.io`) instead of `express`.
 2. Better responses to the server.

## Installation:
1. `FiveAPI_v2-backend`
    ```bash
    npm install socket.io
    ```
2. `FiveAPI_v2-client`
    #### Normally should run without problems, else install **Webpack** and **yarn**

## Example:
This is the example event:

#### `FiveAPI_v2-backend/index.js`
```js
socket.on("PlayerKicked", (data) => {
    console.log("Player Kicked:", data);
});

socket.emit("KickPlayer", {
    id: 1,
    reason: "test",
});
```
#### `FiveAPI_v2-client/index.js`
```js
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
```