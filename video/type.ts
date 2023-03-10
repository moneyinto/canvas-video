export type IListener = (
    this: HTMLVideoElement,
    ev: Event | ProgressEvent<EventTarget> | ErrorEvent
) => any;

export type IEvent =
    | "loadstart"
    | "durationchange"
    | "loadedmetadata"
    | "loadeddata"
    | "progress"
    | "canplay"
    | "canplaythrough"
    | "play"
    | "pause"
    | "seeking"
    | "seeked"
    | "waiting"
    | "playing"
    | "timeupdate"
    | "ended"
    | "error"
    | "volumechange"
    | "stalled"
    | "ratechange";
