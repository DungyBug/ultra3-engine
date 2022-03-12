import WSTransporter from "./client/services/transporter/ws-transporter";
import Transport from "./core/services/transport";

let state: Record<string, any> = {};

let server = new Transport(new WSTransporter("ws://192.168.0.21:3003/"));

server.onMessage((message, res) => {
    console.log(message);
    res("asdf");
});

function frame() {
    server
        .send(
            JSON.stringify({
                type: "get-state",
            }),
            true
        )
        .then((data: string) => {
            state = JSON.parse(data);
        });

    if (state.thisEntity) {
        console.log(state.entities[state.thisEntity].pos);
    }

    requestAnimationFrame(frame);
}

frame();

document.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "KeyW": {
            server.send(
                JSON.stringify({
                    type: "update-player-state",
                    data: {
                        event: "move",
                        angle: 0,
                    },
                }),
                false
            );
            break;
        }
        case "KeyS": {
            server.send(
                JSON.stringify({
                    type: "update-player-state",
                    data: {
                        event: "move",
                        angle: Math.PI,
                    },
                }),
                false
            );
            break;
        }
        case "KeyA": {
            server.send(
                JSON.stringify({
                    type: "update-player-state",
                    data: {
                        event: "move",
                        angle: -Math.PI * 0.5,
                    },
                }),
                false
            );
            break;
        }
        case "KeyD": {
            server.send(
                JSON.stringify({
                    type: "update-player-state",
                    data: {
                        event: "move",
                        angle: Math.PI * 0.5,
                    },
                }),
                false
            );
            break;
        }
    }
});
