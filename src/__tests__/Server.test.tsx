import {DraftServer} from "../DraftServer";
import getPort from "get-port";
import request from "request";
import temp from "temp";
import * as fs from "fs";
import path from "path";
import {default as io} from "socket.io-client";

let httpServer: any;
let httpServerAddr: any;
let ioServer: any;
let draftServer: DraftServer;
let dirPath: string;

beforeEach(() => {
    temp.track();
    dirPath = temp.mkdirSync('serverTest');
    fs.mkdirSync(path.join(dirPath, 'data', 'current'), {recursive: true});
    fs.mkdirSync(path.join(dirPath, 'data', '2020'), {recursive: true});
    fs.writeFileSync(path.join(dirPath, 'data', '2020', `uvwxyz.json`), '{}');
    fs.writeFileSync(path.join(dirPath, 'users.json'),
        '{"admin":"$2b$05$g9CBZUm26K/pRhFeWvsZk.jGo3rza6SX6W98r8pZ6pxeDvrmPmWcm"}');
    draftServer = new DraftServer(dirPath);
});

afterEach(() => {
    temp.cleanupSync();
});


beforeEach((done) => {
    getPort().then((port: number) => {
        console.log("Got port: " + port);
        const serve = draftServer.serve(port);
        httpServer = serve.httpServer;
        httpServerAddr = serve.httpServerAddr;
        ioServer = serve.io;
        done();
    });
});

afterEach((done) => {
    ioServer.close();
    httpServer.close();
    done();
});

it('reloading drafts archive', (done) => {
    const draftId = 'abcde';
    fs.writeFileSync(path.join(dirPath, 'data', '2020', `abcde.json`), '{}');

    request.get(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/draft/${draftId}`,
        (error, response, body) => {
            expect(response.statusCode).toEqual(404);

            request.post(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/reload-archive`,
                {headers: {'Content-Type': 'application/json; charset=UTF-8'}},
                (error, response, body) => {
                    expect(response.statusCode).toEqual(200);
                    const json = JSON.parse(body);
                    expect(json).toEqual(true);

                    request.get(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/draft/${draftId}`,
                        (error, response, body) => {
                            expect(response.statusCode).toEqual(200);
                            const json = JSON.parse(body);
                            expect(json).toEqual({});
                            done();
                        });
                });
        });
});


it('maintenanceMode is initially false', (done) => {
    request.get(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/state`, (error, response, body) => {
        expect(response.statusCode).toEqual(200);
        const json = JSON.parse(body);
        expect(json.maintenanceMode).toEqual(false);
        done();
    });
});

it('maintenanceMode can be set to true', (done) => {
    request.post(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/state`,
        {body: JSON.stringify({maintenanceMode: true}), headers: {'Content-Type': 'application/json; charset=UTF-8'}},
        (error, response, body) => {
            expect(response.statusCode).toEqual(200);
            const json = JSON.parse(body);
            expect(json.maintenanceMode).toEqual(true);
            done();
        });
});

it('hiddenPresetIds is initially empty', (done) => {
    request.get(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/state`, (error, response, body) => {
        expect(response.statusCode).toEqual(200);
        const json = JSON.parse(body);
        expect(json.hiddenPresetIds).toEqual([]);
        done();
    });
});

it('hiddenPresetIds can be filled', (done) => {
    request.post(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/state`,
        {
            body: JSON.stringify({hiddenPresetIds: ['abc', 'xyz']}),
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        },
        (error, response, body) => {
            expect(response.statusCode).toEqual(200);
            const json = JSON.parse(body);
            expect(json.hiddenPresetIds).toEqual(['abc', 'xyz']);
            done();
        });
});


it('get finished draft', (done) => {
    const draftId = 'abcdef';
    fs.writeFileSync(path.join(dirPath, 'data', 'current', `${draftId}.json`), '{}');

    request.get(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/draft/${draftId}`,
        (error, response, body) => {
            expect(response.statusCode).toEqual(200);
            const json = JSON.parse(body);
            expect(json).toEqual({});
            done();
        });
});

it('get old finished draft', (done) => {
    const draftId = 'uvwxyz';

    request.get(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/draft/${draftId}`,
        (error, response, body) => {
            expect(response.statusCode).toEqual(200);
            const json = JSON.parse(body);
            expect(json).toEqual({});
            done();
        });
});

it('get old finished draft via socketio', (done) => {
    const draftId = 'uvwxyz';

    const socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
        query: {draftId: draftId},
        reconnectionDelay: 0,
        forceNew: true,
        transports: ['websocket'],
    });

    socket.on("replay", (message: any) => {
        expect(message).toEqual({});
        done();
    });
});


it('login works', (done) => {
    request.post(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/login`,
        {
            form: {user: 'admin', password: 'password'},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        },
        (error, response, body) => {
            expect(response.statusCode).toEqual(200);
            const json = JSON.parse(body);
            expect(json.apiKey).toBeTruthy();
            done();
        });
});

it('wrong login yields 401', (done) => {
    request.post(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/login`,
        {
            form: {user: 'admin', password: 'wrong password'},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        },
        (error, response, body) => {
            expect(response.statusCode).toEqual(401);
            expect(body).toEqual('');
            done();
        });
});
