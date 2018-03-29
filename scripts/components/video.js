function autoplay(video) {
    video.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
}

function autostop(video) {
    video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
}
