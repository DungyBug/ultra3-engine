import WSTransporter from "./ws-transporter";
import WSServerTransporter from "../../../server/services/transporter/ws-transporter";

import * as http from "http";


describe("WSTransporter", () => {
    const server = new http.Server();

    const serverTransporter = new WSServerTransporter(server);

    const createClient = () => new Promise<WSTransporter>((res, rej) => {
        const client = new WSTransporter("ws://localhost:3216");

        client.on("ready", () => res(client));
        client.on("error", rej);
    });

    // Final test requires sending data to specific client ( and therefore knowing it's id ), so we create global
    // client with id 0
    let client0: WSTransporter;

    beforeAll(async () => {
        server.listen(3216);

        client0 = await createClient();
    });

    afterAll(() => {
        server.close()
    });

    it("should send data to server", cb => {
        createClient().then(client => {
                const random = Math.random().toString();
        
                const text = JSON.stringify("Hello, I'm a new client!" + random);

                serverTransporter.on("message", (message, send, id) => {
                    if(JSON.parse(message) === "Hello, I'm a new client!" + random) {
                        cb();
                    }
                });
        
                client.send({ data: text }, false);
            })
            .catch(cb);
    }, 1000);

    it("should send request and accept the answer", async () => {
        const client = await createClient();
        
        /*
        This test also checks that client is capable sorting answers and giving corresponding to your request answer.
        */
        
        const weatherRequestText = JSON.stringify("What's the weather today?");
        const timeRequestText = JSON.stringify("What time is it now?");
        const todaysWeather = "It's sunny today";
        const timeNow = "It's 9:48 AM at Facing Worlds";

        const sendAndExpect = (data: string, expected: string) => {
            return new Promise(res => {
                client.send({ data }, true)
                    .then(answer => {
                        expect(answer).toBe(expected);
                        res(null);
                    });
            })
        }

        serverTransporter.on("message", (data, send, id) => {
            switch(data) {
                case weatherRequestText: {
                    setTimeout(() => send(todaysWeather), 3000);
                    break;
                }
                case timeRequestText: {
                    setTimeout(() => send(timeNow), 1000);
                    break;
                }
            }
        });

        await Promise.all([
            sendAndExpect(weatherRequestText, todaysWeather),
            sendAndExpect(timeRequestText, timeNow)
        ]);
    }, 8000);

    it("should recieve messages from server", cb => {
        createClient().then(client => {
                const messageText = "It's rainy outside!";

                const handleMessage = jest.fn().mockImplementationOnce((data) => {
                    expect(data).toBe(messageText);
        
                    cb();
                });
        
                client.on("message", handleMessage);
        
                serverTransporter.send({ data: messageText });
            })
            .catch(cb);
    }, 1000);

    it("should recieve requests from server", async () => {
        const client = client0;

        const responses: Record<string, string> = {
            "What's your favourite drink?": "Coca-Cola",
            "What's your favourite game?": "Unreal Tournament"
        };

        let count = 0;

        client.on("message", (data: string, send) => {
            if(count === 2 || !data.startsWith("\"")) {
                return;
            }

            const request = JSON.parse(data);

            if(!Object.keys(responses).includes(request)) {
                return;
            }

            send(responses[request]);

            count++;
        });

        const sendAndExpect = (data: string, expected: string) => {
            return new Promise(res => {
                serverTransporter.send({ data, to: 0 }, true)
                    .then(answer => {
                        expect(answer).toBe(expected);
                        res(null);
                    });
            })
        }

        const requests = Object.keys(responses).map((request) => sendAndExpect(JSON.stringify(request), responses[request] || "??"));

        await Promise.all(requests);
    }, 8000);
});