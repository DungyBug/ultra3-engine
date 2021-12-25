import { IViewableEntityParams } from "../../contracts/entities/base/viewable";

export interface IExplosionEntityParams extends IViewableEntityParams {
    classname: "effect_explosion";
    subExplosionsCount: number;
    duration: number;
    timeBetweenExplosions: number;
    radius: number;
};