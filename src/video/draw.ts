export default class Draw {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _video: HTMLVideoElement;

    private _x: number = 0;
    private _y: number = 0;
    private _width: number = 0;
    private _height: number = 0;

    private _autoRender: boolean = false;
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, video: HTMLVideoElement) {
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
            this._ctx.drawImage(this._video, this._x, this._y, this._width, this._height);
        }
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
}