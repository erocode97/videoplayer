const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume i"),
playPauseBtn = container.querySelector(".play-pause i"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
volumeSlider = container.querySelector(".left input"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
picInPicBtn = container.querySelector(".pic-in-pic span"),
fullscreenBtn = container.querySelector(".fullscreen i");
let timer;

const hideControls = () => {
    if(mainVideo.paused) return; // if video = pause return
    timer=setTimeout (() => { //remove "show-controls" class after 3 sec
        container.classList.remove("show-controls");
    },3000);
}
hideControls();



container.addEventListener("mousemove", () => {
 container.classList.add("show-controls"); //add "show-control" class on mousemovement
 clearTimeout(timer); //cleans timer
 hideControls(); //calling hidecontrols
});

const formattime = time => {
    //gets second minute hours
    let seconds = Math.floor(time % 60),
    minutes  = Math.floor (time / 60),
    hours = Math.floor(time / 3600);


    //
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0)  {
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}



mainVideo.addEventListener("timeupdate" , e => {
   let {  currentTime, duration } = e.target; // Gets currentTime and duration
   let percent = (currentTime / duration) * 100; // Gets percent
   progressBar.style.width = `${percent}%`; //Gets passing percent effect as progressbar 
   currentVidTime.innerText = formattime(currentTime);
});

mainVideo.addEventListener("loadeddata", e => {
    videoDuration.innerText = formattime(e.target.duration);
});



videoTimeline.addEventListener("click", e=> {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; //updates video currenttime
});

const draggableProgressBar = e => {
    let timelineWidth =videoTimeline.clientWidth; //gets videotimeline width
    progressBar.style.width = `${e.offsetX}px`; // syncronizing value and progressbar width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; //updates video currenttime
    currentVidTime.innerText = formattime(mainVideo.currentTime); // 
}






videoTimeline.addEventListener("mousedown", () =>{ //drag events
    videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

container.addEventListener("mouseup", () =>{ 
    videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeline.addEventListener("mousemove", e  =>{
    const progressTime = videoTimeline.querySelector("span");
    let offsetX = e.offsetX; //gets mousex position
    progressTime.style.left = `${offsetX}px`; //sync offsetx value and progresstime left value
    let timelineWidth=videoTimeline.clientWidth; //gets videotimeline width
    let percent = (e.offsetX / timelineWidth) * mainVideo.duration; //gets percent
    progressTime.innerText = formattime(percent); //percent and progresstime inner text sync
})


volumeBtn.addEventListener("click", () =>{
    if(!volumeBtn.classList.contains("fa-volume-high")){ // volume icon != volume icon
      mainVideo.volume= 0.5; // get higher volume
      volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    }else{
        mainVideo.volume = 0.0; //muted situation
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeSlider.value = mainVideo.volume; // slider-volume syncronize 
});

volumeSlider.addEventListener("input", e => {//slider value on volume
    mainVideo.volume = e.target.value;
    if(e.target.value == 0){// slider value = 0 => icon changes to mute
        volumeBtn.classList.replace("fa-volume-high","fa-volume-xmark");
    }else{
        volumeBtn.classList.replace("fa-volume-xmark","fa-volume-high");
    }
});

speedBtn.addEventListener("click", () =>{
 speedOptions.classList.toggle("show");
});

speedOptions.querySelectorAll("li").forEach(option => {
 option.addEventListener("click", () => {// click event for video speed
    mainVideo.playbackRate = option.dataset.speed; 
    speedOptions.querySelector(".active").classList.remove("active");//it changes to which speed active
    option.classList.add("active");// adds active class on the selected speed
 });
});



    

document.addEventListener("click", e =>{ //hide speed options onclick
 if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded"){
    speedOptions.classList.remove("show");
 }
});

picInPicBtn.addEventListener("click", () => {
    mainVideo.requestPictureInPicture(); //video mode changes to video mode --> pic in pic
})

fullscreenBtn.addEventListener("click", () =>{
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement){
        fullscreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen;
    }
    fullscreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen;
});



skipBackward.addEventListener("click", () =>{
    mainVideo.currentTime -=5; //going back 5 sec from video time
});

skipForward.addEventListener("click",() => {
    mainVideo.currentTime +=5;//Going forward 5 sec from video time
})




playPauseBtn.addEventListener("click", () => {
    //paused --> played conditions
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {//play--> pause / pause --> play icon changes
    playPauseBtn.classList.replace("fa-play","fa-pause");
});

mainVideo.addEventListener("pause", () =>{//play--> pause / pause --> play icon changes
    playPauseBtn.classList.replace("fa-pause","fa-play");
});