import Video from "./video";

window.onload = () => {
    const container = document.querySelector<HTMLDivElement>("#video");
    if (container) {
        const video = new Video(container, 600, 400);

        // video.oncanplay = () => {
        //     video.play();
        // };

        // video.addEventListener("canplay", () => {
        //     video.play();
        // });

        video.src = "/video.mp4";
    }
};
