import {default as io} from "socket.io-client"
import {DraftServer} from "../DraftServer";
import request from "request"
import Player from "../constants/Player";
import {IDraftConfig} from "../types/IDraftConfig";
import getPort from "get-port";
import Preset from "../models/Preset";
import {Barrier} from "../test/Barrier";
import temp from "temp";
import * as fs from "fs";
import path from "path";

let hostSocket: any;
let clientSocket: any;
let spectatorSocket: any;
let httpServer: any;
let httpServerAddr: any;
let ioServer: any;
let draftId: string;
let draftServer: DraftServer;


beforeAll(() => {
    temp.track();
    const dirPath = temp.mkdirSync('serverTest');
    fs.mkdirSync(path.join(dirPath, 'data'));
    draftServer = new DraftServer(dirPath);
});

afterAll(() => {
    temp.cleanupSync();
});


beforeAll((done) => {
    getPort().then((port: number) => {
        console.log("Got port: " + port);
        const serve = draftServer.serve(port);
        httpServer = serve.httpServer;
        httpServerAddr = serve.httpServerAddr;
        ioServer = serve.io;
        done();
    });
});

afterAll((done) => {
    ioServer.close();
    httpServer.close();
    done();
});

function connect() {
    return io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
        query: {draftId: draftId},
        reconnectionDelay: 0,
        forceNew: true,
        transports: ['websocket'],
    });
}

beforeEach((done) => {
    const barrier = new Barrier(3, done);
    request.post(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/draft/new`,
        {body: JSON.stringify({preset: Preset.SIMPLE}), headers: {'Content-Type': 'application/json; charset=UTF-8'}},
        (error, response, body) => {
            const draftIdContainer: { draftId: string } = JSON.parse(body);
            draftId = draftIdContainer.draftId;

            hostSocket = connect();
            hostSocket.on('connect', () => {
                barrier.trigger();
            });

            clientSocket = connect();
            clientSocket.on('connect', () => {
                barrier.trigger();
            });

            spectatorSocket = connect();
            spectatorSocket.on('connect', () => {
                barrier.trigger();
            });
        });
});

afterEach((done) => {
    if (hostSocket.connected) {
        hostSocket.disconnect();
    }
    if (clientSocket.connected) {
        clientSocket.disconnect();
    }
    if (spectatorSocket.connected) {
        spectatorSocket.disconnect();
    }
    done();
});

it('successful join gets a draft config', (done) => {
    hostSocket.emit('set_role', {name: 'Saladin', role: Player.HOST}, (data: IDraftConfig) => {
        data.startTimestamp = 0;
        expect(data).toMatchSnapshot();
        done();
    });
});


it('should send player_set_role when player sets role', (done) => {
    const barrier = new Barrier(2, done);
    hostSocket.once("player_set_role", (message: any) => {
        expect(message.name).toBe('Saladin');
        expect(message.playerType).toBe(Player.HOST);

        hostSocket.once("player_set_role", (message: any) => {
            expect(message.name).toBe('Barbarossa');
            expect(message.playerType).toBe(Player.GUEST);
            barrier.trigger();
        });
        clientSocket.emit('set_role', {name: 'Barbarossa', role: Player.GUEST}, () => {
        });
    });

    clientSocket.once("player_set_role", (message: any) => {
        expect(message.name).toBe('Saladin');
        expect(message.playerType).toBe(Player.HOST);

        clientSocket.once("player_set_role", (message: any) => {
            expect(message.name).toBe('Barbarossa');
            expect(message.playerType).toBe(Player.GUEST);
            barrier.trigger();
        });
    });

    hostSocket.emit('set_role', {name: 'Saladin', role: Player.HOST}, () => {
    });
});

it('players can change their names', (done) => {
    const barrier = new Barrier(4, done);
    hostSocket.once('player_set_name', (message: any) => {
        expect(message.name).toEqual('Attila The Hun');
        hostSocket.once('player_set_name', (message: any) => {
            expect(message.name).toEqual('Bleda The Hun');
            barrier.trigger();
        });
    });
    clientSocket.once('player_set_name', (message: any) => {
        expect(message.name).toEqual('Attila The Hun');
        clientSocket.once('player_set_name', (message: any) => {
            expect(message.name).toEqual('Bleda The Hun');
            barrier.trigger();
        });
    });
    spectatorSocket.once('player_set_name', (message: any) => {
        expect(message.name).toEqual('Attila The Hun');
        spectatorSocket.once('player_set_name', (message: any) => {
            expect(message.name).toEqual('Bleda The Hun');
            barrier.trigger();
        });
    });
    const newHostName = "Attila The Hun";
    const newGuestName = "Bleda The Hun";
    hostSocket.emit('set_role', {name: 'Saladin', role: Player.HOST}, () => {
        clientSocket.emit('set_role', {name: 'Barbarossa', role: Player.GUEST}, () => {
            clientSocket.emit('ready', {}, () => {
                hostSocket.emit('set_name', {
                    "name": newHostName
                }, () => {
                    hostSocket.emit('ready', {}, () => {
                        clientSocket.emit('set_name', {
                            "name": newGuestName
                        }, () => {
                            // done
                            const secondSpectatorSocket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
                                query: {draftId: draftId},
                                reconnectionDelay: 0,
                                forceNew: true,
                                transports: ['websocket'],
                            });
                            secondSpectatorSocket.once('draft_state', (message: any) => {
                                expect(message.nameHost).toEqual(newHostName);
                                expect(message.nameGuest).toEqual(newGuestName);
                                barrier.trigger();
                            });
                        });
                    });
                });
            });
        });
    });
});

it('fully execute sample draft', (done) => {
    const barrier = new Barrier(2, done);
    hostSocket.once('disconnect', () => {
        barrier.trigger();
    });
    clientSocket.once('disconnect', () => {
        barrier.trigger();
    });
    hostSocket.emit('set_role', {name: 'Saladin', role: Player.HOST}, () => {
        clientSocket.emit('set_role', {name: 'Barbarossa', role: Player.GUEST}, () => {
            clientSocket.emit('ready', {}, () => {
                hostSocket.emit('ready', {}, () => {
                    hostSocket.emit('act', {
                        "player": "HOST",
                        "executingPlayer": "HOST",
                        "actionType": "ban",
                        "civilisation": {"name": "Celts", "gameVersion": 1, "isRandomlyChosenCiv": false}
                    }, () => {
                        clientSocket.emit('act', {
                            "player": "GUEST",
                            "executingPlayer": "GUEST",
                            "actionType": "ban",
                            "civilisation": {"name": "Celts", "gameVersion": 1, "isRandomlyChosenCiv": false}
                        }, () => {
                            clientSocket.emit('act', {
                                "player": "GUEST",
                                "executingPlayer": "GUEST",
                                "actionType": "pick",
                                "civilisation": {"name": "Slavs", "gameVersion": 3, "isRandomlyChosenCiv": false}
                            }, () => {
                                hostSocket.emit('act', {
                                    "player": "HOST",
                                    "executingPlayer": "HOST",
                                    "actionType": "pick",
                                    "civilisation": {"name": "Slavs", "gameVersion": 3, "isRandomlyChosenCiv": false}
                                }, () => {
                                    // preset done
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});