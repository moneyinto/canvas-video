import { throttleRAF } from "./utils";

export default class Video {
    private _container: HTMLDivElement;
    private _video: HTMLVideoElement | null;

    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    private _src: string; // 视频播放链接
    private _width: number;
    private _height: number;

    private _updateDebounce: null | number;
    constructor(container: HTMLDivElement, width?: number, height?: number) {
        this._container = container;
        this._video = null;

        this._updateDebounce = null;

        this._src = "";
        this._width = width || 320;
        this._height = height || 200;

        const { canvas, ctx } = this._createCanvas();

        this._canvas = canvas;
        this._ctx = ctx;
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
        console.log("重置 canvas", this._canvas);
        this._canvas.style.width = `${this._width}px`;
        this._canvas.style.height = `${this._height}px`;

        const dpr = window.devicePixelRatio;
        this._canvas.width = this._width * dpr;
        this._canvas.height = this._height * dpr;
        this._ctx.scale(dpr, dpr);
    }

    private _initVideo() {
        this._video = document.createElement("video");
        this._video.style.display = "none";
        this._video.oncanplay = () => {
            console.log("xxxxxx");
        };
        this._video.src = this._src;
        // document.body.appendChild(this._video);
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
        return this._src;
    }

    set src(src: string) {
        this._src = src;
        this._initVideo();
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
