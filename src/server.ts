import * as express from "express";
import {Server} from "http"
import * as socketio from "socket.io";

const app = express();
app.set("port", process.env.PORT || 3000);

const server = new Server(app);
const io = socketio(server);
const nsp = io.of('/gQkQ');

app.use(express.static('build'));

io.on("connection", (socket: socketio.Socket) => {
    // console.log("a user connected");
});

nsp.on("connection", (socket: socketio.Socket) => {
    // console.log("a user connected to the room");

    socket.on("join", (message: any) => {
        // console.log("player joined:", message);
        nsp.emit("player_joined", message);
    });
});

server.listen(3000, () => {
    // console.log("listening on *:3000");
});