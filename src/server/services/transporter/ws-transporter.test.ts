import WSTransporter from "./ws-transporter";
import * as http from "http";
import { WebSocket, RawData } from "ws";
import { IWSSendOpts } from "../../contracts/ws-send-opts";
import { Socket } from "net";

const makeMessageObject = (id: number, data: string, type: "request" | "answer" = "request") => (
    JSON.stringify({
        id: id,
        type: type,
        data: data,
    })
);

describe("WSTransporter", () => {
    const server = new http.Server();
    const transporter = new WSTransporter(server);

    let client1: WebSocket;
    let client2: WebSocket;
    let client3: WebSocket;
    let client4: WebSocket;
    let client5: WebSocket;

    beforeAll(() => {
        server.listen(3100);
    });

    afterAll((cb) => {
        let count = 0;

        const handleDisconnection = () => {
            count++;

            if(count === 3) {
                server.close();

                cb();
            }
        }

        client1.on("close", handleDisconnection);
        client2.on("close", handleDisconnection);
        client3.on("close", handleDisconnection);
        client4.on("close", handleDisconnection);

        client1.close();
        client2.close();
        client3.close();
        client4.close();
        client5.close();
    }, 3000);

    it("should handle connections from three users", cb => {
        const result = jest.fn().mockImplementationOnce((...args) => cb(...args));

        /*
        We watch here, that WSTransporter can handle 3 connections without disconnecting any of them, even if
        all go from one ip address.
        */

        let count = 0;

        // Check that "connection" event emitted 3 times

        const handleConnection = () => {
            count++;

            if(count === 3) {
                result();
            }
        }

        transporter.on("connection", handleConnection);

        // Check that all clients can connect to server and don't disconnect from it

        client1 = new WebSocket("ws://localhost:3100/");

        client1.on("error", (error) => {
            if(error.message === "test error") {
                return;
            }

            result("Connection of client 1 failed");
        });

        client1.on("open", () => {
            client2 = new WebSocket("ws://localhost:3100/");

            client2.on("error", () => {
                result("Connection of client 2 failed");
            });

            client2.on("open", () => {
                client3 = new WebSocket("ws://localhost:3100/");

                client3.on("error", () => {
                    result("Connection of client 3 failed");
                });

                // I don't think client 3 can connect to server and suddenly disconnect from it by error in the code,
                // but let it be here
                client3.on("close", (code: number, reason: Buffer) => {
                    // If we close connection manually, then we don't want error to be raised
                    if(reason.toString() === "manually") {
                        return;
                    }

                    result("Connection of client 3 closed!");
                });
            });

            // Client 2 can be disconnected when client 3 is connected
            client2.on("close", (code: number, reason: Buffer) => {
                // If we close connection manually, then we don't want error to be raised
                if(reason.toString() === "manually") {
                    return;
                }

                result("Connection of client 2 closed!");
            });
        });

        // Client 1 can be disconnected when client 2 is connected
        client1.on("close", (code: number, reason: Buffer) => {
            // If we close connection manually, then we don't want error to be raised
            if(reason.toString() === "manually") {
                return;
            }

            result("Connection of client 1 closed!");
        });
    }, 5000);

    it("should send data to all clients", async () => {
        /*
        This test simply checks that server sends data to all 3 clients.
        Fail means that server by some reason hasn't all 3 clients kept in memory and probably
        problem is in connection handler.
        */

        const waitForMessage = (client: WebSocket) => {
            return new Promise(res => {
                client.on("message", res);
            });
        }

        const promises = [
            waitForMessage(client1),
            waitForMessage(client2),
            waitForMessage(client3)
        ]

        transporter.send({ data: "Hello, world!" });

        await Promise.all(promises);
    }, 5000);

    it("should send data to client 1 and client 3 only", cb => {
        /*
        This test checks that "send" method with parameter "to" provided actually sends data to specified client.
        Btw, it checks that despite of all 3 clients have the same IP, the server CAN send message to SPECIFIC client.
        */

        let count = 0;

        const messageCorrect = () => {
            count++;

            if(count === 2) {
                cb();
            }
        }

        const handleMessage = (expectedMessage: string, message: RawData) => {
            if(message.toString() === expectedMessage) {
                messageCorrect();
            } else {
                // Ignore messages if this test passed succefully
                if(count === 2) {
                    return;
                }

                cb(`Incorrect message: expected ${expectedMessage}, got ${message.toString()}`);
            }
        }

        client1.on("message", handleMessage.bind(this, makeMessageObject(0, "Hi, client1!")));
        client2.on("message", handleMessage.bind(this, makeMessageObject(0, "Hi, client2!")));

        transporter.send({to: 0, data: "Hi, client1!"});
        transporter.send({to: 1, data: "Hi, client2!"});
    }, 5000);

    it("should use freed ID of disconnected client 2 for client 4", cb => {
        let success = false;

        const handleDisconnection = jest.fn().mockImplementationOnce((connectionID: number) => {
            if(connectionID !== 1) {
                cb(`\"disconnection\" event provided incorrect id: expected 1, got ${connectionID}`);
            } else {
                // "disconnect" event can emit later than client4 connects to server, so make sure
                // client4 is connected AFTER client2 disconnected
                client4 = new WebSocket("ws://192.168.0.21:3100");
            }
        });

        const handleConnection = jest.fn().mockImplementationOnce((connectionID: number) => {
            expect(connectionID).toBe(1);
            cb();
        });

        transporter.on("disconnection", handleDisconnection);
        transporter.on("connection", handleConnection);

        client2.close(1000, "manually");
    }, 5000);

    it("should receive answers from clients", async () => {
        const handleMessage = function(this: WebSocket, add: string, data: RawData) {
            const request = JSON.parse(data.toString());

            if(typeof request["data"] === "string") {
                request.data += add;
            }

            request.type = "answer";

            this.send(JSON.stringify(request), (err) => {
                if(err) {
                    throw err;
                }
            });
        }

        client1.on("message", handleMessage.bind(client1, "client1"));
        client3.on("message", handleMessage.bind(client3, "client3"));
        client4.on("message", handleMessage.bind(client4, "client4"));

        const sendAndExpect = (toSend: IWSSendOpts, expected: string) => {
            return new Promise(res => {
                transporter.send(toSend, true)
                    .then(answer => {
                        expect(answer).toBe(expected);
                        res(null);
                    });
            })
        }

        await Promise.all([
            sendAndExpect({to: 0, data: "Hello, world!"}, "Hello, world!client1"),
            sendAndExpect({to: 0, data: "MrX"}, "MrXclient1"),
            sendAndExpect({to: 1, data: "Batman rises..."}, "Batman rises...client4"),
            sendAndExpect({to: 2, data: "FloppaSogga"}, "FloppaSoggaclient3"),
            sendAndExpect({to: 1, data: "Hello from "}, "Hello from client4"),
        ])
    }, 1000);

    it("should receive request from client", (cb) => {
        const handleMessage = (expectedMessage: string, message: RawData) => {
            expect(message.toString()).toBe(expectedMessage);
            cb();
        }

        transporter.on("message", (message, res) => {
            res(message);
        });

        const message = makeMessageObject(1, "some important data", "request");
        const expectedMessage = makeMessageObject(1, "some important data", "answer");

        client4.once("message", (data) => handleMessage(expectedMessage, data));

        client4.send(message);
    }, 1000);

    it("should fail when providing non-existing client id", cb => {
        transporter.send({to: 10, data: "whatever"}, true)
            .then(answer => {
                cb("Somehow got answer from non-existing client: ", answer);
            })
            .catch(reason => {
                if(typeof reason === "string" && reason === "no such client") {
                    cb();
                } else {
                    cb(`Incorrect reason: expected \"no such client\", got \"${reason}\"`);
                }
            })
    });

    /**
     * Tests below describe how WSTransporter must behave when an error
     * or unexpected case has occurred.
    */

    it("should emit \"disconnection\" event and free ID", async () => {
        const waitConnection = () => new Promise((res) => {
            transporter.on("connection", (connectionID) => {
                expect(connectionID).toBe(3);
                res(null);
            })
        });

        const waitDisconnection = () => new Promise(res => {
            let isDisconnected = false;

            transporter.on("disconnection", () => {
                if(isDisconnected) {
                    return;
                }

                isDisconnected = true;

                client5 = new WebSocket("ws://192.168.0.21:3100");
    
                // Wait till client5 opens connection to avoid crashing in afterAll callback, where
                // client5 closes connection before establishing it
                client5.on("open", () => res(null));
            });
        });

        const waitError = () => new Promise(res => {
            transporter.on("error", (error) => {
                res(null);
            });
        });

        const promises = [
            waitConnection(),
            waitDisconnection(),
            waitError(),
        ];

        const mockClient = new WebSocket(null);

        transporter.handleConnection(mockClient, new http.IncomingMessage(new Socket({})));

        mockClient.emit("error", new Error("An unexpected error has been occurred"));

        await Promise.all(promises);
    }, 2000);
});