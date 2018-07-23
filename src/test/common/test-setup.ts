import { Server } from "http";
import { startServer } from "../../server/server";

let server: Server;
const host = "localhost";
const port = 8087; // TODO: randomize

before(done => {
    startServer(() => { /* nop-logger*/ }, host, port)
        .then((s: Server) => {
            server = s;
            done();
        }).catch(e => {
            console.log("Test Server startup failed.");
            console.log(e);
        });
});

after(done => {
    (server as any).destroy(done);
});
