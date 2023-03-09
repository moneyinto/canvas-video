import Video from "./video";

window.onload = () => {
    const container = document.querySelector<HTMLDivElement>("#video");
    if (container) {
        const instance = new Video(container);
    }
};
