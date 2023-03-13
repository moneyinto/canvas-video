// throttle callback to execute once per animation frame
export const throttleRAF = <T extends unknown[]>(fn: (...args: T) => void) => {
    let handle: number | null = null;
    let lastArgs: T | null = null;
    let callback: ((...args: T) => void) | null = null;
    const ret = (...args: T) => {
        lastArgs = args;
        callback = fn;
        if (handle === null) {
            handle = window.requestAnimationFrame(() => {
                handle = null;
                lastArgs = null;
                callback = null;
                fn(...args);
            });
        }
    };
    ret.flush = () => {
        if (handle !== null) {
            cancelAnimationFrame(handle);
            handle = null;
        }
        if (lastArgs) {
            const _lastArgs = lastArgs;
            const _callback = callback;
            lastArgs = null;
            callback = null;
            if (_callback !== null) {
                _callback(..._lastArgs);
            }
        }
    };
    ret.cancel = () => {
        lastArgs = null;
        callback = null;
        if (handle !== null) {
            cancelAnimationFrame(handle);
            handle = null;
        }
    };
    return ret;
};

export const fomatTime = (time: number) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time - h * 3600) / 60);
    const s = Math.floor(time - h * 3600 - m * 60);
    const hStr = `${h.toString().padStart(2, "0")}`;
    return `${hStr === "00" ? "" : hStr + ":"}${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export const enterFullScreen = () => {
    const docElm: any = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullscreen) {
        docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
};

export const exitFullScreen = () => {
    const dom: any = document;
    if (dom.exitFullscreen) dom.exitFullscreen();
    else if (dom.mozCancelFullScreen) dom.mozCancelFullScreen();
    else if (dom.webkitCancelFullScreen) dom.webkitCancelFullScreen();
    else if (dom.msExitFullscreen) dom.msExitFullscreen();
};

export const isFullScreen = () => {
    const dom: any = document;
    return !!(dom.mozFullScreen || dom.webkitIsFullScreen || dom.webkitFullScreen || dom.msFullScreen);
};
