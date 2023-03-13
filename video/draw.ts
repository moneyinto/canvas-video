import { fomatTime } from "./utils";

export default class Draw {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _video: HTMLVideoElement;

    private _x: number = 0;
    private _y: number = 0;
    private _width: number = 0;
    private _height: number = 0;

    public progressWidth = 320 - 40;
    public controlX = 20;
    public controlY = 200 - 80;

    public playBtnActive = false;
    public progressActive = false;
    public progress = 0;
    public loadProgress = 0;

    private _autoRender: boolean = false;
    constructor(
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        video: HTMLVideoElement
    ) {
        this._canvas = canvas;
        this._ctx = ctx;
        this._video = video;
    }

    public init() {
        const videoWidth = this._video.clientWidth;
        const videoHeight = this._video.clientHeight;
        const cavnasWidth = this._canvas.width;
        const canvasHeight = this._canvas.height;

        const ratio = videoHeight / videoWidth;
        // 宽度作为标准
        if (cavnasWidth * ratio <= canvasHeight) {
            this._width = cavnasWidth;
            this._height = cavnasWidth * ratio;
            this._x = 0;
            this._y = (canvasHeight - this._height) / 2;
        } else {
            this._width = canvasHeight / ratio;
            this._height = canvasHeight;
            this._x = (cavnasWidth - this._width) / 2;
            this._y = 0;
        }

        this.progressWidth = this._canvas.width - 40;
        this.controlX = 20;
        this.controlY = this._canvas.height - 80;
    }

    set autoRender(autoRender: boolean) {
        this._autoRender = autoRender;
    }

    public clear() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    public render() {
        if (this._video) {
            this.clear();
            this._ctx.fillStyle = "#000000";
            this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
            this._ctx.drawImage(
                this._video,
                this._x,
                this._y,
                this._width,
                this._height
            );

            this._renderControl();
        }
    }

    private _renderControl() {
        this.renderControlBg();
        this.renderPlayBtn();
        this.renderPauseBtn();
        this.renderProgress();
        this.renderTime();
    }

    public startRender() {
        this._autoRender = true;
        window.requestAnimationFrame(() => {
            if (this._autoRender) {
                this.render();
                this.startRender();
            }
        });
    }

    public stopRender() {
        this._autoRender = false;
    }

    // 回执控制栏背景
    public renderControlBg() {
        this._ctx.save();
        const lineargradient = this._ctx.createLinearGradient(
            this._canvas.width / 2,
            this._canvas.height,
            this._canvas.width / 2,
            this.controlY
        );
        lineargradient.addColorStop(0, "#000000b0");
        lineargradient.addColorStop(1, "#00000000");
        this._ctx.fillStyle = lineargradient;
        this._ctx.fillRect(
            0,
            this.controlY,
            this._canvas.width,
            80
        );
        this._ctx.restore();
    }

    public renderPlayBtn() {
        if (!this._video.paused) return;
        this._ctx.save();
        this._ctx.translate(this.controlX + 10, this.controlY + 50);
        this._ctx.globalAlpha = this.playBtnActive ? 1 : 0.8;
        this._ctx.lineCap = "round";
        this._ctx.lineWidth = 2;
        this._ctx.strokeStyle = "#ffffff";
        this._ctx.beginPath();
        this._ctx.moveTo(0, 0);
        this._ctx.lineTo(0, 12);
        this._ctx.lineTo(10.392, 6);
        this._ctx.closePath();
        this._ctx.stroke();
        this._ctx.restore();
    }

    public renderPauseBtn() {
        if (this._video.paused) return;
        this._ctx.save();
        this._ctx.translate(this.controlX + 10, this.controlY + 50);
        this._ctx.globalAlpha = this.playBtnActive ? 1 : 0.8;
        this._ctx.lineCap = "round";
        this._ctx.lineWidth = 2;
        this._ctx.strokeStyle = "#ffffff";
        this._ctx.beginPath();
        this._ctx.moveTo(2, 0);
        this._ctx.lineTo(2, 12);
        this._ctx.moveTo(10, 0);
        this._ctx.lineTo(10, 12);
        this._ctx.stroke();
        this._ctx.restore();
    }

    public renderProgress() {
        this._ctx.save();
        this._ctx.translate(this.controlX, this.controlY + 35);
        this._ctx.globalAlpha = 0.3;
        this._ctx.lineCap = "round";
        this._ctx.lineWidth = 4;
        this._ctx.strokeStyle = "#ffffff";
        this._ctx.beginPath();
        this._ctx.moveTo(0, 0);
        this._ctx.lineTo(this.progressWidth, 0);
        this._ctx.stroke();

        if (this.progressActive) {
            this._ctx.fillStyle = "#ffffff";
            this._ctx.globalAlpha = 1;
            this._ctx.beginPath();
            this._ctx.arc(this.progressWidth * this.progress, 0, 5, 0, 360);
            this._ctx.fill();
        }

        // 缓存进度条
        this._ctx.globalAlpha = 0.5;
        this._ctx.beginPath();
        this._ctx.moveTo(0, 0);
        this._ctx.lineTo(this.progressWidth * this.loadProgress, 0);
        this._ctx.stroke();

        // 播放进度条
        this._ctx.globalAlpha = 1;
        this._ctx.beginPath();
        this._ctx.moveTo(0, 0);
        this._ctx.lineTo(this.progressWidth * this.progress, 0);
        this._ctx.stroke();

        this._ctx.restore();
    }

    public renderTime() {
        this._ctx.save();
        this._ctx.translate(this.controlX, this.controlY + 50);

        this._ctx.fillStyle = "#ffffff";
        this._ctx.font = "12px sans-serif";
        const currentTime = fomatTime(this._video.currentTime);
        const duration = fomatTime(this._video.duration);
        this._ctx.fillText(`${currentTime} / ${duration}`, 40, 11);

        this._ctx.restore();
    }
}
