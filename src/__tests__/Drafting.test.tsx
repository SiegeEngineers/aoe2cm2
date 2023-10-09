import {default as io} from "socket.io-client"
import {DraftServer} from "../DraftServer";
import request from "request"
import Player from "../constants/Player";
import {IRecentDraft} from "../types";
import {IDraftConfig} from "../types/IDraftConfig";
import getPort from "get-port";
import Preset from "../models/Preset";
import {Barrier} from "../test/Barrier";
import temp from "temp";
import * as fs from "fs";
import {AddressInfo} from "net";
import path from "path";
import {BarrierPromise} from "../test/BarrierPromise";
import Civilisation from "../models/Civilisation";
import Turn from "../models/Turn";
import Action from "../constants/Action";
import Exclusivity from "../constants/Exclusivity";
import {ActListener} from "../util/ActListener";

let hostSocket: any;
let hostEmit: any;
let clientSocket: any;
let guestEmit: any;
let spectatorSocket: any;
let lobbySocket: any;
let lobbyEmit: any;
let httpServer: any;
let httpServerAddr: string;
let ioServer: any;
let draftId: string;
let draftServer: DraftServer;


beforeAll(() => {
    temp.track();
    const dirPath = temp.mkdirSync('serverTest');
    fs.mkdirSync(path.join(dirPath, 'data', 'current'), {recursive: true});
    fs.writeFileSync(path.join(dirPath, 'serverState.json'), JSON.stringify({maintenanceMode: false, hiddenPresetIds: ['hidden']}));
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
        const addr = serve.httpServerAddr as AddressInfo;
        httpServerAddr = `[${addr.address}]:${addr.port}`;
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
    return io.connect(`http://${httpServerAddr}`, {
        query: {draftId: draftId},
        reconnectionDelay: 0,
        forceNew: true,
        transports: ['websocket'],
    });
}

function connectLobby() {
    return io.connect(`http://${httpServerAddr}`, {
        query: {lobby: true},
        reconnectionDelay: 0,
        forceNew: true,
        transports: ['websocket'],
    });
}

function createDraftForPreset(preset: Preset) {
    const barrier = new BarrierPromise(4);
    request.post(`http://${httpServerAddr}/api/draft/new`,
        {body: JSON.stringify({preset: preset}), headers: {'Content-Type': 'application/json; charset=UTF-8'}},
        (error, response, body) => {
            const draftIdContainer: { draftId: string } = JSON.parse(body);
            draftId = draftIdContainer.draftId;

            hostSocket = connect();
            hostEmit = (action: string, data: object) => {
                return new Promise<object>((resolve, reject) => {
                    hostSocket.emit(action, data, (response: object) => {
                        resolve(response);
                    })
                })
            };
            hostSocket.on('connect', () => {
                barrier.trigger();
            });

            clientSocket = connect();
            guestEmit = (action: string, data: object) => {
                return new Promise<object>((resolve, reject) => {
                    clientSocket.emit(action, data, (response: object) => {
                        resolve(response);
                    })
                })
            };
            clientSocket.on('connect', () => {
                barrier.trigger();
            });

            spectatorSocket = connect();
            spectatorSocket.on('connect', () => {
                barrier.trigger();
            });

            lobbySocket = connectLobby();
            lobbyEmit = (action: string, data: object) => {
                return new Promise<object>((resolve, reject) => {
                    lobbySocket.emit(action, data, (response: object) => {
                        resolve(response);
                    })
                })
            };
            lobbySocket.on('connect', () => {
                barrier.trigger();
            });

        });
    return barrier.promise;
}

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
    if (lobbySocket.connected) {
        lobbySocket.disconnect();
    }
    done();
});

it('successful join gets a draft config', (done) => {
    createDraftForPreset(Preset.SIMPLE).then(value => {
        hostSocket.emit('set_role', {name: 'Saladin', role: Player.HOST}, (data: IDraftConfig) => {
            data.startTimestamp = 0;
            expect(data).toMatchSnapshot();
            done();
        });
    });
});


it('should send player_set_role when player sets role', (done) => {
    createDraftForPreset(Preset.SIMPLE).then(value => {
        const barrier = new Barrier(2, done);
        hostSocket.once("player_set_role", (message: any) => {
            expect(message.name).toBe('Saladin');
            expect(message.playerType).toBe(Player.HOST);

            hostSocket.once("player_set_role", (message: any) => {
                expect(message.name).toBe('Barbarossa');
                expect(message.playerType).toBe(Player.GUEST);
                barrier.trigger();
            });
            guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST});
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

        hostEmit('set_role', {name: 'Saladin', role: Player.HOST});
    });
});

it('players can change their names', (done) => {
    createDraftForPreset(Preset.SIMPLE).then(value => {
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
        hostEmit('set_role', {name: 'Saladin', role: Player.HOST})
            .then(() => guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST}))
            .then(() => guestEmit('ready', {}))
            .then(() => hostEmit('set_name', {"name": newHostName}))
            .then(() => hostEmit('ready', {}))
            .then(() => guestEmit('set_name', {"name": newGuestName}))
            .then(() => {
                // done
                const secondSpectatorSocket = io.connect(`http://${httpServerAddr}`, {
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

it('fully execute sample draft', (done) => {
    createDraftForPreset(Preset.SIMPLE).then(value => {
        const barrier = new Barrier(2, done);
        hostSocket.once('disconnect', () => {
            barrier.trigger();
        });
        clientSocket.once('disconnect', () => {
            barrier.trigger();
        });

        hostEmit('set_role', {name: 'Saladin', role: Player.HOST})
            .then(() => guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST}))
            .then(() => guestEmit('ready', {}))
            .then(() => hostEmit('ready', {}))
            .then(() => hostEmit('act', {
                "player": "HOST",
                "executingPlayer": "HOST",
                "actionType": "ban",
                "chosenOptionId": "Celts",
                "isRandomlyChosen": false,
            }))
            .then(() => guestEmit('act', {
                "player": "GUEST",
                "executingPlayer": "GUEST",
                "actionType": "ban",
                "chosenOptionId": "Celts",
                "isRandomlyChosen": false,
            }))
            .then(() => guestEmit('act', {
                "player": "GUEST",
                "executingPlayer": "GUEST",
                "actionType": "pick",
                "chosenOptionId": "Slavs",
                "isRandomlyChosen": false,
            }))
            .then(() => hostEmit('act', {
                "player": "HOST",
                "executingPlayer": "HOST",
                "actionType": "pick",
                "chosenOptionId": "Slavs",
                "isRandomlyChosen": false,
            }));
    });
});

it('preset consisting only of admin action', (done) => {
    Reflect.set(ActListener, "adminTurnDelay", 10);
    const preset = new Preset('Admin only preset', Civilisation.ALL_ACTIVE, [
        new Turn(Player.NONE, Action.PICK, Exclusivity.NONEXCLUSIVE),
        new Turn(Player.HOST, Action.PICK, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
        new Turn(Player.HOST, Action.PICK, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
        new Turn(Player.GUEST, Action.PICK, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
        new Turn(Player.NONE, Action.BAN, Exclusivity.NONEXCLUSIVE),
        new Turn(Player.HOST, Action.BAN, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
        new Turn(Player.GUEST, Action.BAN, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
        new Turn(Player.HOST, Action.SNIPE, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
        new Turn(Player.GUEST, Action.SNIPE, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
        new Turn(Player.HOST, Action.STEAL, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
        new Turn(Player.GUEST, Action.STEAL, Exclusivity.NONEXCLUSIVE, false, false, Player.NONE),
    ]);
    createDraftForPreset(preset).then(value => {
        const barrier = new Barrier(2, done);
        hostSocket.once('disconnect', () => {
            barrier.trigger();
        });
        clientSocket.once('disconnect', () => {
            barrier.trigger();
        });

        hostEmit('set_role', {name: 'Saladin', role: Player.HOST})
            .then(() => guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST}))
            .then(() => guestEmit('ready', {}))
            .then(() => hostEmit('ready', {}));
    });
});

it('draft with invalid act', (done) => {
    createDraftForPreset(Preset.SIMPLE).then(value => {

        hostEmit('set_role', {name: 'Saladin', role: Player.HOST})
            .then(() => guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST}))
            .then(() => guestEmit('ready', {}))
            .then(() => hostEmit('ready', {}))
            .then(() => hostEmit('act', {
                "player": "HOST",
                "executingPlayer": "HOST",
                "actionType": "ban",
                "chosenOptionId": "Celts",
                "isRandomlyChosen": false,
            }))
            .then(() => hostEmit('act', {
                "player": "HOST",
                "executingPlayer": "HOST",
                "actionType": "ban",
                "chosenOptionId": "Mongols",
                "isRandomlyChosen": false,
            }))
            .then((response: object) => {
                expect(response).toEqual({
                    "status": "error",
                    "validationErrors": ["VLD_001"],
                });
                done();
            });
    });
});

it('ongoing draft with only host not visible in lobby', (done) => {
    createDraftForPreset(Preset.SIMPLE).then(value => {
        hostEmit('set_role', {name: 'Saladin', role: Player.HOST})
            .then(() => guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST}))
            .then(() => lobbyEmit('spectate_drafts', {}))
            .then((drafts: IRecentDraft[]) => {
                expect(drafts.filter(draft => draft.draftId === draftId)).toHaveLength(1);
                done();
            });
    });
});

it('ongoing draft should be visible in lobby', (done) => {
    createDraftForPreset(Preset.SIMPLE).then(value => {
        hostEmit('set_role', {name: 'Saladin', role: Player.HOST})
            .then(() => guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST}))
            .then(() => lobbyEmit('spectate_drafts', {}))
            .then((drafts: IRecentDraft[]) => {
                expect(drafts.filter(draft => draft.draftId === draftId)).toHaveLength(1);
                done();
            });
    });
});

it('ongoing draft should become visible in lobby once second player joins', (done) => {
    createDraftForPreset(Preset.SIMPLE).then(() => {
        lobbySocket.once('draft_update', (draft:IRecentDraft) => {
            expect(draft.draftId).toBe(draftId);
            done();
        });

        hostEmit('set_role', {name: 'Saladin', role: Player.HOST})
            .then(() => lobbyEmit('spectate_drafts', {}))
            .then((drafts: IRecentDraft[]) => {
                expect(drafts.filter(draft => draft.draftId === draftId)).toHaveLength(0);
            })
            .then(() => guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST}));
    });
});

it('ongoing draft with member leaving should be abandoned', (done) => {
    createDraftForPreset(Preset.SIMPLE).then(value => {
        lobbySocket.once('draft_abandoned', (draft:string) => {
            expect(draft).toBe(draftId);
            done();
        });

        hostEmit('set_role', {name: 'Saladin', role: Player.HOST})
            .then(() => guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST}))
            .then(() => lobbyEmit('spectate_drafts', {}))
            .then((drafts: IRecentDraft[]) => {
                expect(drafts.filter(draft => draft.draftId === draftId)).toHaveLength(1);
            })
            .then(() => clientSocket.disconnect());
    });
});

it('ongoing draft should notify when players are ready', (done) => {
    createDraftForPreset(Preset.SIMPLE).then(value => {
        lobbySocket.once('draft_update', (draft:IRecentDraft) => {
            expect(draft.draftId).toBe(draftId);
            done();
        });

        hostEmit('set_role', {name: 'Saladin', role: Player.HOST})
            .then(() => guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST}))
            .then(() => lobbyEmit('spectate_drafts', {}))
            .then((drafts: IRecentDraft[]) => {
                expect(drafts.filter(draft => draft.draftId === draftId)).toHaveLength(1);
            })
            .then(() => hostEmit('ready', {}))
            .then(() => guestEmit('ready', {}));
    });
});

it('ongoing draft should notify when draft finishes', (done) => {
    createDraftForPreset(Preset.SIMPLE).then(value => {
        lobbySocket.once('draft_update', (draft:IRecentDraft) => {
            expect(draft.draftId).toBe(draftId);
            done();
        });

        hostEmit('set_role', {name: 'Saladin', role: Player.HOST})
            .then(() => guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST}))
            .then(() => lobbyEmit('spectate_drafts', {}))
            .then(() => hostEmit('ready', {}))
            .then(() => guestEmit('ready', {}))
            .then((drafts: IRecentDraft[]) => {
                expect(drafts.filter(draft => draft.draftId === draftId)).toHaveLength(1);
            })
            .then(() => hostEmit('act', {
                "player": "HOST",
                "executingPlayer": "HOST",
                "actionType": "ban",
                "chosenOptionId": "Celts",
                "isRandomlyChosen": false,
            }))
            .then(() => guestEmit('act', {
                "player": "GUEST",
                "executingPlayer": "GUEST",
                "actionType": "ban",
                "chosenOptionId": "Celts",
                "isRandomlyChosen": false,
            }))
            .then(() => guestEmit('act', {
                "player": "GUEST",
                "executingPlayer": "GUEST",
                "actionType": "pick",
                "chosenOptionId": "Slavs",
                "isRandomlyChosen": false,
            }))
            .then(() => hostEmit('act', {
                "player": "HOST",
                "executingPlayer": "HOST",
                "actionType": "pick",
                "chosenOptionId": "Slavs",
                "isRandomlyChosen": false,
            }));
    });
});

it('ongoing draft from hidden preset should not become visible in lobby', (done) => {
    const hiddenPreset = Preset.fromPojo({...Preset.SIMPLE, presetId: 'hidden'})!;
    createDraftForPreset(hiddenPreset).then(() => {
        const fn = jest.fn();
        lobbySocket.once('draft_update', (draft:IRecentDraft) => {
            expect(draft.draftId).toBe(draftId);
            fn();
        });

        hostEmit('set_role', {name: 'Saladin', role: Player.HOST})
            .then(() => lobbyEmit('spectate_drafts', {}))
            .then((drafts: IRecentDraft[]) => {
                expect(drafts.filter(draft => draft.draftId === draftId)).toHaveLength(0);
            })
            .then(() => guestEmit('set_role', {name: 'Barbarossa', role: Player.GUEST}))
            .then(() => hostEmit('ready', {}))
            .then(() => guestEmit('ready', {}))
            .then(() => hostEmit('act', {
                "player": "HOST",
                "executingPlayer": "HOST",
                "actionType": "ban",
                "chosenOptionId": "Celts",
                "isRandomlyChosen": false,
            }))
            .then(() => guestEmit('act', {
                "player": "GUEST",
                "executingPlayer": "GUEST",
                "actionType": "ban",
                "chosenOptionId": "Celts",
                "isRandomlyChosen": false,
            }))
            .then(() => guestEmit('act', {
                "player": "GUEST",
                "executingPlayer": "GUEST",
                "actionType": "pick",
                "chosenOptionId": "Slavs",
                "isRandomlyChosen": false,
            }))
            .then(() => hostEmit('act', {
                "player": "HOST",
                "executingPlayer": "HOST",
                "actionType": "pick",
                "chosenOptionId": "Slavs",
                "isRandomlyChosen": false,
            }))
            .then(() => {
                expect(fn).toHaveBeenCalledTimes(0);
                done();
            });
    });
});
