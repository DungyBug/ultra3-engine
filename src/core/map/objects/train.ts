import { IBaseTrain, IBaseTrainProps } from "../../contracts/map-objects/train";
import { MapObject } from "../../map-object";
import { World } from "../../world";

export class BaseTrain extends MapObject implements IBaseTrain {
    readonly end: boolean;

    constructor(params: IBaseTrainProps, world: World) {
        super("", params, world);
        this.end = params.end;
    }
    
    getPos() {
        return this.props.pos;
    }
}