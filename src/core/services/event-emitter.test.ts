import { EventEmitter } from "./event-emitter";

describe("EventEmitter", () => {
    const eventEmitter = new EventEmitter<Record<string, any[]>>();

    it("should call function on event emit", async () => {
        await new Promise(res => {
            eventEmitter.on("someEvent", (a, b) => {
                expect(a).toBe(3);
                expect(b).toBe(6);

                res(null);
            });

            eventEmitter.emit("someEvent", 3, 6);
        })
    }, 1000);

    it("should call functions on event emit", async () => {
        const handleEventEmit = () => {
            return new Promise(res => eventEmitter.on("anotherEvent", (someStr: string) => {
                expect(someStr).toBe("special string");

                res(null);
            }));
        }
        
        const promises = [
            handleEventEmit(),
            handleEventEmit(),
            handleEventEmit()
        ];

        eventEmitter.emit("anotherEvent", "special string");

        await Promise.all(promises);
    }, 1000);

    it("should not provide any arguments", async () => {
        await new Promise(res => {
            eventEmitter.on("event", (...args) => {
                expect([...args]).toEqual([]);
                res(null);
            });

            eventEmitter.emit("event");
        });
    });

    it("should not fail when emitting event with no subscribers", () => {
        eventEmitter.emit("devilEvent", "devil", "hell");
    }, 1000);

    it("should call functions subscribed to all events", async () => {
        const createEventHandler = () => {
            return new Promise(res => {
                eventEmitter.on("all", () => res(null));
            });
        }

        const promises = [
            createEventHandler(),
            createEventHandler()
        ];

        eventEmitter.emit("asdf");

        await Promise.all(promises);
    }, 1000);
})