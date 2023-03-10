import Draw from "./draw";
import Listener from "./listener";
import { IEvent, IListener } from "./type";

export default class Video {
    private _container: HTMLDivElement;
    private _video: HTMLVideoElement;

    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _draw: Draw;
    private _listener: Listener;

    private _width: number;
    private _height: number;

    public oncanplay: Function | null;

    private _updateDebounce: null | number;
    constructor(container: HTMLDivElement, width?: number, height?: number) {
        this._container = container;

        this._updateDebounce = null;

        this._width = width || 320;
        this._height = height || 200;

        this.oncanplay = null;

        const { canvas, ctx } = this._createCanvas();

        this._canvas = canvas;
        this._ctx = ctx;

        this._video = this._initVideo();
        this._draw = new Draw(this._canvas, this._ctx, this._video);
        this._listener = new Listener(this._video, this._draw);
    }

    private _createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.style.width = `${this._width}px`;
        canvas.style.height = `${this._height}px`;
        this._container.appendChild(canvas);

        // 调整分辨率
        const dpr = window.devicePixelRatio;
        canvas.width = this._width * dpr;
        canvas.height = this._height * dpr;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        ctx.scale(dpr, dpr);

        return { ctx, canvas };
    }

    private _resetCanvas() {
        this._canvas.style.width = `${this._width}px`;
        this._canvas.style.height = `${this._height}px`;

        const dpr = window.devicePixelRatio;
        this._canvas.width = this._width * dpr;
        this._canvas.height = this._height * dpr;
        this._ctx.scale(dpr, dpr);

        this._draw.init();
        this._draw.render();
    }

    private _initVideo() {
        const video = document.createElement("video");
        video.muted = true;
        // this._video.controls = true;
        // video.style.visibility = "hidden";
        video.style.position = "absolute";
        // video.style.zIndex = "-1000";
        // this._video.style.left = "-10000px";
        video.oncanplay = () => {
            console.log("x=x==x=x=x canplay");
            this._draw.init();
            this._draw.render();
            this.oncanplay && this.oncanplay();
        };
        document.body.appendChild(video);
        return video;
    }

    play() {
        this._video.play();
    }

    pause() {
        this._video.pause();
    }

    addEventListener(event: IEvent, listener: IListener) {
        this._listener.add(event, listener);
    }

    removeEventListener(event: IEvent, listener: IListener) {
        this._listener.remove(event, listener);
    }

    get width() {
        return this._width;
    }

    set width(width: number) {
        this._width = width;
        this._debounce(this._resetCanvas.bind(this));
    }

    get height() {
        return this._height;
    }

    set height(height: number) {
        this._height = height;
        this._debounce(this._resetCanvas.bind(this));
    }

    get src() {
        return this._video.src;
    }

    set src(src: string) {
        this._video.src = src;
    }

    get paused() {
        return this._video.paused;
    }

    private _debounce(callback: () => void) {
        // 防抖延迟
        if (this._updateDebounce) {
            clearTimeout(this._updateDebounce);
            this._updateDebounce = null;
        }

        this._updateDebounce = setTimeout(() => {
            callback();
            this._updateDebounce = null;
        }, 300);
    }
}
