import WSTransporter from "./client/services/transporter/ws-transporter";
import Transport from "./core/services/transport";

let server = new Transport(new WSTransporter("ws://192.168.0.21:3000/"));

server.onMessage((message, res) => {
    console.log(message);
    res("asdf");
});

setTimeout(
    () => server.send("Hello!", true).then(console.log),
    1646669176746 - Date.now()
);
