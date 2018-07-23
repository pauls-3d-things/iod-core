import { startServer } from "./server";

const start = () => {
    return startServer(console.log).then(server => {
        console.log("Server started.");
    }).catch(() => {
        console.log("Server failed, trying again");
        setTimeout(start, 3000);
    });
};

start().catch(error => {
    console.log(error);
    console.log("Failed to start.");
});
