import {randomUUID} from "crypto";
import fs from "fs";
import {compareSync} from "bcrypt";
import {logger} from "../util/Logger";

class Session {
    readonly user: string
    readonly expires: number

    constructor(user: string, expires: number) {
        this.user = user;
        this.expires = expires;
    }

    public get active() {
        return Date.now() < this.expires;
    }
}

export class SessionStore {
    private readonly sessionDurationSeconds = 6 * 30 * 24 * 60 * 60;
    private readonly usersfile: string;
    private readonly sessionsfile: string;
    private sessions: Map<string, Session>;

    constructor(usersfile: string, sessionsfile: string) {
        this.usersfile = usersfile;
        this.sessionsfile = sessionsfile;
        this.sessions = this.loadSessionsFile();
    }

    private loadSessionsFile(): Map<string, Session> {
        let sessions = new Map<string, Session>();
        if (fs.existsSync(this.sessionsfile)) {
            const fileContent = fs.readFileSync(this.sessionsfile);
            const sessionsData = JSON.parse(fileContent.toString());
            sessions = new Map<string, Session>(sessionsData);
            for (let [key, session] of sessions.entries()) {
                sessions.set(key, new Session(session.user, session.expires));
            }
        }
        return sessions;
    }

    private storeSessionsFile() {
        const now = Date.now();
        for (let [key, session] of this.sessions.entries()) {
            if (session.expires < now) {
                this.sessions.delete(key);
            }
        }
        fs.writeFileSync(this.sessionsfile, JSON.stringify([...this.sessions]));
    }

    private checkCredentials(user: string, password: string): boolean {
        let userDb = {};
        if (fs.existsSync(this.usersfile)) {
            const fileContent = fs.readFileSync(this.usersfile);
            userDb = JSON.parse(fileContent.toString());
        }
        const users = new Map<string, string>(Object.entries(userDb));
        if (users.has(user)) {
            const hash = users.get(user) as string;
            return compareSync(password, hash);
        }
        return false;
    }

    public authenticate(user: string, password: string): string | undefined {
        if (!this.checkCredentials(user, password)) {
            logger.info("Failed login attempt for user '%s'", user);
            return undefined;
        }
        logger.info("Logged in user '%s'", user);
        const expires = Date.now() + this.sessionDurationSeconds;
        const session = new Session(user, expires);
        const apiKey = randomUUID();
        this.sessions.set(apiKey, session);
        this.storeSessionsFile();
        return apiKey;
    }

    public isApiKeyValid(apiKey: string): boolean {
        const session = this.sessions.get(apiKey);
        if (!session) {
            return false;
        }
        return session.active;
    }

    public getUser(apiKey: string): string | undefined {
        const session = this.sessions.get(apiKey);
        if (!session) {
            return undefined;
        }
        return session.user;
    }
}