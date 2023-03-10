import Draw from "./draw";
import { IEvent, IListener } from "./type";

export default class Listener {
    private _video: HTMLVideoElement;
    private _draw: Draw;
    constructor(video: HTMLVideoElement, draw: Draw) {
        this._video = video;
        this._draw = draw;

        this._video.addEventListener("play", () => {
            this._draw.startRender();
        });

        this._video.addEventListener("pause", () => {
            this._draw.stopRender();
        });

        this._video.addEventListener("ended", () => {
            this._draw.stopRender();
            this._draw.render();
        });

        this._video.addEventListener("timeupdate", () => {
            this._draw.progress = this._video.currentTime / this._video.duration;
            if (this._video.buffered.length > 0) {
                this._draw.loadProgress = this._video.buffered.end(0) / this._video.duration;
            }
        });
    }

    add(event: IEvent, listener: IListener) {
        this._video.addEventListener(event, listener);
    }

    remove(event: IEvent, listener: IListener) {
        this._video.removeEventListener(event, listener);
    }
}
