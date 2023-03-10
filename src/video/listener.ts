import Draw from "./draw";
import { IEvent, IListener } from "./type";

export default class Listener {
    private _video: HTMLVideoElement;
    private _draw: Draw;
    constructor(video: HTMLVideoElement, draw: Draw) {
        this._video = video;
        this._draw = draw;

        this._video.addEventListener("play", () => {
            this._draw?.startRender();
        });

        this._video.addEventListener("pause", () => {
            this._draw?.stopRender();
        });
    }

    add(event: IEvent, listener: IListener) {
        this._video.addEventListener(event, listener);
    }

    remove(event: IEvent, listener: IListener) {
        this._video.removeEventListener(event, listener);
    }
}
