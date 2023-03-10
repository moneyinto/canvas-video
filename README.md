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
import Video from "video";
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