export enum EVENTS {
    LOAD_START = "loadstart", // 加载过程开始
    DURATION_CHANGE = "durationchange", // 时长数据发生变化
    LOADED_META_DATA = "loadedmetadata", // 元数据已加载
    LOADED_DATA = "loadeddata", // 当前帧的数据已加载
    PROGRESS = "progress", // 下载指定的视频时
    CANPLAY = "canplay", // 当视频可播放时
    CANPLAY_THROUGH = "canplaythrough", // 当视频可流畅播放
    PLAY = "play", // 播放
    PAUSE = "pause", // 暂停
    SEEKING = "seeking", // 当用户开始移动/跳跃到视频中新的位置时触发
    SEEKED = "seeked", // 用户已经移动/跳跃到视频中新的位置时触发
    WAITING = "waiting", // 视频加载等待
    PLAYING = "playing", // 当视频在已因缓冲而暂停或停止后已就绪时
    TIME_UPDATE = "timeupdate", // 目前的播放位置已更改时
    ENDED = "ended", // 播放结束
    ERROR = "error", // 播放错误
    VOLUME_CHANGE = "volumechange", // 当音量更改时
    STALLED = "stalled", // 当浏览器尝试获取媒体数据，但数据不可用时
    RATE_CHANGE = "ratechange" // 当视频的播放速度已更改时
}