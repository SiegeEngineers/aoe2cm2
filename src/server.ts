import * as express from "express";
import {Server} from "http"
import * as socketio from "socket.io";
import Player from "./models/Player";
import {IDraftConfig} from "./models/IDraftConfig";
import {IJoinMessage} from "./models/IJoinMessage";

const app = express();
app.set("port", process.env.PORT || 3000);

const server = new Server(app);
const io = socketio(server);
const nsp = io.of('/gQkQ');
let nameHost = '…';
let nameGuest = '…';

app.use(express.static('build'));

io.on("connection", (socket: socketio.Socket) => {
    console.log("a user connected");
});

nsp.on("connection", (socket: socketio.Socket) => {
    console.log("a user connected to the namespace");

    const rooms = Object.keys(nsp.adapter.rooms);
    console.log('rooms', rooms);
    if (!rooms.includes('host')) {
        socket.join('host');
        const message = {nameHost, nameGuest, youAre: Player.HOST};
        console.log('sending', message);
    } else if (!rooms.includes('guest')) {
        socket.join('guest');
        const message = {nameHost, nameGuest, youAre: Player.GUEST};
        console.log('sending', message);
    } else {
        socket.join('spec');
        const message = {nameHost, nameGuest, youAre: Player.NONE};
        console.log('sending', message);
    }

    socket.on("join", (message: IJoinMessage, fn: (dc: IDraftConfig) => void) => {
        console.log("player joined:", message);
        let playerType: Player = Player.NONE;
        if (Object.keys(socket.rooms).includes('host')) {
            nameHost = message.name;
            playerType = Player.HOST;
        } else if (Object.keys(socket.rooms).includes('guest')) {
            nameGuest = message.name;
            playerType = Player.GUEST
        }
        nsp.emit("player_joined", {name: message.name, playerType});
        fn({nameHost, nameGuest, yourPlayerType: playerType});
    });

    socket.on("act", (message: any) => {
        console.log(message);
        if (validate(message)) {
            nsp.emit("playerEvent", message);
        }
    });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});

function validate(message: any) {
    return true;
}
