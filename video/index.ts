import Draw from "./draw";
import Listener from "./listener";
import { IEvent, IListener } from "./type";
import { enterFullScreen, exitFullScreen, isFullScreen, throttleRAF } from "./utils";

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

    private _updateDebounce: any;
    private _renderInterval: number = 0;
    private _renderTimeout: number = 0;
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

        this._canvas.addEventListener(
            "mousemove",
            throttleRAF(this._mousemove.bind(this))
        );

        this._canvas.addEventListener(
            "mousedown",
            throttleRAF(this._mousedown.bind(this))
        );

        this._canvas.addEventListener(
            "mouseenter",
            throttleRAF(this._mouseenter.bind(this))
        );

        this._canvas.addEventListener(
            "mouseleave",
            throttleRAF(this._mouseleave.bind(this))
        );

        window.addEventListener("mouseout", this._leaveRender.bind(this));

        window.addEventListener("blur", this._leaveRender.bind(this));

        window.addEventListener("resize", () => {
            if (!isFullScreen()) {
                // 退出全屏
                this._draw.isFullScreen = false;
                this._canvas.style.position = "relative";
                this._debounce(this._resetCanvas.bind(this, this._width, this._height));
            } else {
                this._canvas.style.position = "absolute";
                this._debounce(this._resetCanvas.bind(this, ...(this._draw.isFullScreen ? [window.innerWidth, window.innerHeight] : [this._width, this._height])));
            }
        });
    }

    private _createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.style.width = `${this._width}px`;
        canvas.style.height = `${this._height}px`;
        canvas.style.zIndex = "100000";
        canvas.style.transition = "0.3s all";
        this._container.appendChild(canvas);

        // 调整分辨率
        const dpr = window.devicePixelRatio;
        canvas.width = this._width * dpr;
        canvas.height = this._height * dpr;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        ctx.scale(dpr, dpr);

        return { ctx, canvas };
    }

    private _resetCanvas(width: number, height: number) {
        this._canvas.style.width = `${width}px`;
        this._canvas.style.height = `${height}px`;

        const dpr = window.devicePixelRatio;
        this._canvas.width = width * dpr;
        this._canvas.height = height * dpr;
        this._ctx.scale(dpr, dpr);

        this._draw.init();
        this._draw.render();
    }

    private _initVideo() {
        const video = document.createElement("video");
        // video.muted = true;
        // video.controls = true;
        video.style.visibility = "hidden";
        video.style.position = "absolute";
        video.style.zIndex = "-1000";
        // this._video.style.left = "-10000px";
        document.body.appendChild(video);
        video.oncanplay = () => {
            // 延迟一段时间
            setTimeout(() => {
                this._draw.init();
                this._draw.render();
                this.oncanplay && this.oncanplay();
            }, 100);
        };
        return video;
    }

    private _mousedown(event: MouseEvent) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        const isOutControl =
            mouseX >= 0 &&
            mouseY >= 0 &&
            mouseX <= this._width &&
            mouseY <= this._height - 60;
        if (this._draw.playBtnActive || isOutControl) {
            // 播放 暂停
            this._video.paused ? this.play() : this.pause();
            this._draw.render();
        } else if (this._draw.progressActive) {
            const progress = (mouseX - 20) / this._draw.progressWidth;
            this._video.currentTime = this._video.duration * progress;
        } else if (this._draw.fullScreenActive) {
            if (this._draw.isFullScreen) {
                this._draw.isFullScreen = false;
                exitFullScreen();
            } else {
                this._draw.isFullScreen = true;
                enterFullScreen();
                if (isFullScreen()) {
                    this._canvas.style.position = "absolute";
                    this._debounce(this._resetCanvas.bind(this, window.innerWidth, window.innerHeight));
                }
            }
        }
    }

    private _leaveRender() {
        if (
            this._draw.playBtnActive ||
            this._draw.progressActive ||
            this._draw.fullScreenActive
        ) {
            this._canvas.style.cursor = "default";
            this._draw.fullScreenActive = false;
            this._draw.playBtnActive = false;
            this._draw.progressActive = false;
            this._draw.render();
        }
    }

    private _mouseenter() {
        clearInterval(this._renderInterval);
        clearTimeout(this._renderTimeout);
        this._draw.controlY = this._height - 80;
        this._draw.render();
    }

    private _mouseleave() {
        if (!this._video.paused) {
            this._renderTimeout = setTimeout(() => {
                clearInterval(this._renderInterval);
                this._renderInterval = setInterval(() => {
                    if (this._draw.controlY < this._height + 10) {
                        this._draw.controlY += 3;
                    } else {
                        clearInterval(this._renderInterval);
                    }
                }, 30);
            }, 3000);
        }
    }

    private _mousemove(event: MouseEvent) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        if (
            mouseX >= 30 &&
            mouseX < 41 &&
            mouseY >= this._height - 30 &&
            mouseY <= this._height - 30 + 12
        ) {
            if (!this._draw.playBtnActive) {
                // 播放 暂停按钮区域
                this._canvas.style.cursor = "pointer";
                this._draw.playBtnActive = true;
                this._draw.render();
            }
        } else if (
            mouseX >= 20 &&
            mouseX <= this._width - 20 &&
            mouseY >= this._height - 50 &&
            mouseY <= this._height - 50 + 8
        ) {
            if (!this._draw.progressActive) {
                // 进度条区域
                this._canvas.style.cursor = "pointer";
                this._draw.progressActive = true;
                this._draw.render();
            }
        } else if (
            mouseX <= this._width - 30 &&
            mouseX >= this._width - 30 - 12 &&
            mouseY <= this._height - 30 + 12 &&
            mouseY >= this._height - 30
        ) {
            if (!this._draw.fullScreenActive) {
                // 进全屏区域
                this._canvas.style.cursor = "pointer";
                this._draw.fullScreenActive = true;
                this._draw.render();
            }
        } else {
            this._leaveRender();
        }
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
        this._debounce(this._resetCanvas.bind(this, width, this._height));
    }

    get height() {
        return this._height;
    }

    set height(height: number) {
        this._height = height;
        this._debounce(this._resetCanvas.bind(this, this._width, height));
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
