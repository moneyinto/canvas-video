<p align="center">
    <img style="width: 192px;" src="./public/favicon.png" />
</p>

<p align="center">
    <a href="https://github.com/moneyinto/canvas-ppt/stargazers" target="_black">
        <img src="https://img.shields.io/github/stars/moneyinto/canvas-video?logo=github" alt="stars" />
    </a>
    <a href="https://www.github.com/moneyinto/canvas-ppt/network/members" target="_black">
        <img src="https://img.shields.io/github/forks/moneyinto/canvas-video?logo=github" alt="forks" />
    </a>
    <a href="https://www.typescriptlang.org" target="_black">
        <img src="https://img.shields.io/badge/language-TypeScript-blue.svg" alt="language">
    </a>
    <a href="https://github.com/moneyinto/canvas-video/issues" target="_black">
        <img src="https://img.shields.io/github/issues-closed/moneyinto/canvas-video.svg" alt="issue">
    </a>
</p>

### Canvas 视频播放器

- 绘制视频影像
- 绘制控制区域蒙层
- 绘制播放暂停按钮
- 绘制进度条
- 绘制进度时间
- 绘制进度条悬浮位置标识
- 点击进度条更新当前视频帧

### 使用
```shell
npm install m-canvas-video
```

```html
<div class="canvas-video" id="video"></div>
```

```ts
import Video from "m-canvas-video";
const container = document.querySelector<HTMLDivElement>("#video");
if (container) {
    const video = new Video(container, 600, 400);

    video.src = "视频链接";

    // 继承了原生video的一些属性及事件监听
}
```

#### 问题记录
- 过段时间后视频变白
- 视频初始化缓存进度存在问题
