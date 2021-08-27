import { World } from "./world";

export class State {
    static world: World;
    static errors: Array<string>;
    static catchError(message: string) {
        console.error(message);
        this.errors.push(message);
        this.onError(message);
    }
    static onError(message: string) {

    }
};