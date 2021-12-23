import { IViewableEntityParams } from "../../entities/base/Viewable";

export interface IExplosionEntityParams extends IViewableEntityParams {
    classname: "effect_explosion";
    subExplosionsCount: number;
    duration: number;
    timeBetweenExplosions: number;
    radius: number;
};