document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
    if (e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && ["I", "J", "C", "i", "j", "c"].includes(e.key)) ||
        (e.ctrlKey && ["U", "u"].includes(e.key))) {
        e.preventDefault();
    }
});

let player;
let isPlayerReady = false;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(freq = 600, duration = 0.05, vol = 0.1) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// 1. นาฬิกาประเทศไทย (Real-time)
function updateClock() {
    const clockEl = document.getElementById("th-clock");
    const now = new Date();
    // แปลงเวลาให้เป็นโซนเวลาของไทย (Asia/Bangkok)
    const options = { timeZone: 'Asia/Bangkok', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeString = now.toLocaleTimeString('en-US', options);
    clockEl.innerText = `[ TH: ${timeString} ]`;
}

async function initSystem() {
    document.getElementById("device-display").innerText = navigator.platform + " [" + navigator.userAgent.substring(0, 15) + "...]";
    playBeep(400, 0.1);

    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        document.getElementById("ip-display").innerText = data.ip;
        playBeep(500, 0.1);
    } catch {
        document.getElementById("ip-display").innerText = "192.168.UNKNOWN";
    }

    loadYouTubeIframeAPI();
}
window.onload = initSystem;

function loadYouTubeIframeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-player', {
        height: '0', width: '0',
        playerVars: {
            'listType': 'playlist',
            'list': 'PLba6pJZhQQhXRblDh1XDGre-ieixuG2rk', 
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    isPlayerReady = true;
    const apiStatus = document.getElementById("api-status");
    apiStatus.innerText = "> AUDIO_SERVER_CONNECTED";
    apiStatus.classList.replace("text-warning", "text-success");
    
    setTimeout(() => {
        document.getElementById("enter-btn").classList.remove("d-none");
        playBeep(800, 0.2);
    }, 800);
}

document.getElementById("enter-btn").addEventListener("click", () => {
    playBeep(1200, 0.3, 0.2);
    document.getElementById("intro-screen").classList.add("d-none");
    document.getElementById("main-screen").classList.remove("d-none");
    document.getElementById("main-screen").classList.add("d-flex");
    document.getElementById("bg-video").classList.remove("d-none");
    document.getElementById("video-overlay").classList.remove("d-none");

    startTypingName();
    startGreetingCycle();
    
    // เริ่มเดินนาฬิกา
    setInterval(updateClock, 1000);
    updateClock();

    if(isPlayerReady && player) {
        player.playVideo();
    }
});

function onPlayerStateChange(event) {
    const playIcon = document.querySelector("#play-btn i");
    const titleEl = document.getElementById("song-title");

    if (event.data == YT.PlayerState.PLAYING) {
        playIcon.className = "fas fa-pause";
        let videoData = player.getVideoData();
        if(videoData && videoData.title) {
            titleEl.innerText = videoData.title;
        }
    } else if (event.data == YT.PlayerState.PAUSED) {
        playIcon.className = "fas fa-play";
        titleEl.innerText = "[ PAUSED ]";
    }
}

document.getElementById("play-btn").addEventListener("click", () => {
    if(!isPlayerReady) return;
    if(player.getPlayerState() == YT.PlayerState.PLAYING) player.pauseVideo();
    else player.playVideo();
});

document.getElementById("next-btn").addEventListener("click", () => { if(isPlayerReady) player.nextVideo(); });
document.getElementById("prev-btn").addEventListener("click", () => { if(isPlayerReady) player.previousVideo(); });

function startTypingName() {
    const nameStr = "FLUKKIEBOYY";
    const nameEl = document.getElementById("main-name");
    let i = 0;
    const typeInterval = setInterval(() => {
        nameEl.innerHTML += nameStr.charAt(i);
        playBeep(700, 0.02);
        i++;
        if (i >= nameStr.length) clearInterval(typeInterval);
    }, 200);
}

function startGreetingCycle() {
    const greetings = ["สวัสดีคนแปลกหน้า", "ยินดีที่ได้รู้จัก", "SYSTEM CONNECTED"];
    const greetEl = document.getElementById("greeting-text");
    let greetIdx = 0;
    greetEl.innerText = greetings[greetIdx];

    setInterval(() => {
        greetEl.style.opacity = 0;
        setTimeout(() => {
            greetIdx = (greetIdx + 1) % greetings.length;
            greetEl.innerText = greetings[greetIdx];
            greetEl.style.opacity = 1;
        }, 500);
    }, 4000);
}

// 2. ระบบ Copy Discord Username
document.getElementById("discord-btn").addEventListener("click", () => {
    const discordUsername = "morichyy";
    
    // คำสั่งคัดลอกลง Clipboard
    navigator.clipboard.writeText(discordUsername).then(() => {
        // เล่นเสียง Beep เล็กน้อยตอนกด
        playBeep(900, 0.1, 0.1);
        
        // โชว์แจ้งเตือน
        const toast = document.getElementById("copy-toast");
        toast.classList.remove("d-none");
        
        // ซ่อนแจ้งเตือนหลังจาก 2.5 วินาที
        setTimeout(() => {
            toast.classList.add("d-none");
        }, 2500);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
});