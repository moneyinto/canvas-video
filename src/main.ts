import Video from "./video";

window.onload = () => {
    const container = document.querySelector<HTMLDivElement>("#video");
    if (container) {
        const video = new Video(container);
        video.src = "/video.mp4";
        video.height = 1000;
        video.width = 1000;
    }
};
