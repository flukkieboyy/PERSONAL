// ==========================================
// 1. ระบบป้องกัน DevTools (Advanced Security)
// ==========================================

// 1.1 บล็อกการคลิกขวาแบบสมบูรณ์
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

// 1.2 บล็อกปุ่มลัดทุกชนิด (ครอบคลุมทั้ง Windows และ Mac)
document.addEventListener("keydown", (e) => {
    if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && ["I", "J", "C", "i", "j", "c"].includes(e.key)) || // Windows DevTools
        (e.ctrlKey && ["U", "u"].includes(e.key)) || // Windows View Source
        (e.metaKey && e.altKey && ["I", "J", "C", "i", "j", "c"].includes(e.key)) || // Mac DevTools
        (e.metaKey && ["U", "u"].includes(e.key)) // Mac View Source
    ) {
        e.preventDefault();
        // (ตัวเลือกเสริม) ใส่เสียงแจ้งเตือนตอนมีคนพยายามกดปุ่ม
        try { if(typeof playBeep === "function") playBeep(200, 0.3, 0.5); } catch(err){}
    }
});

// 1.3 ยิงข้อความขู่ลงใน Console (ถ้าเขาฝืนเปิดเข้ามาได้)
setTimeout(() => {
    console.clear();
    console.log("%c🛑 ACCESS DENIED!", "color: #ff004c; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0px #000; font-family: sans-serif;");
    console.log("%cSECURITY PROTOCOL INITIATED. YOUR ATTEMPT HAS BEEN LOGGED.", "color: #00ffcc; font-size: 16px; font-family: monospace;");
}, 1000);

// 1.4 ท่าไม้ตาย: Debugger Trap (กับดักทำให้จอค้าง)
// *คำเตือน: เวลาคุณ (เจ้าของเว็บ) จะแก้โค้ดเอง ให้เอา // มาคอมเมนต์บรรทัด setInterval นี้ไว้ชั่วคราวนะครับ ไม่งั้นคุณก็จะแก้ไม่ได้เหมือนกัน!

setInterval(function() {
    const before = new Date().getTime();
    
    // คำสั่งนี้จะไปหยุดการทำงานของเบราว์เซอร์ ถ้า DevTools ถูกเปิดอยู่
    debugger; 
    
    const after = new Date().getTime();
    if (after - before > 100) {
        // ถ้าเวลาต่างกันมาก แปลว่าเว็บติด Debugger = มีคนเปิด DevTools
        // สั่งเคลียร์หน้าจอทิ้งทันที และเตะออกไปหน้าเว็บเปล่า
        document.body.innerHTML = "<div style='background: black; color: red; height: 100vh; display: flex; justify-content: center; align-items: center; font-family: monospace; font-size: 24px;'>SECURITY BREACH DETECTED. SYSTEM LOCKED.</div>";
        window.location.replace("https://file.garden/aech34tN8glaOMqR/get-rekt-lil-bitch/RICK"); 
    }
}, 1000);

// ==========================================
// 2. ตัวแปรระบบ & เสียง Hacking
// ==========================================
let player;
let isPlayerReady = false;
let progressInterval;

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

// ==========================================
// 3. นาฬิกาประเทศไทย
// ==========================================
function updateClock() {
    const clockEl = document.getElementById("th-clock");
    const dateEl = document.getElementById("th-date");
    if(!clockEl || !dateEl) return;

    const now = new Date();
    
    // 1. จัดการส่วนเวลา (Time)
    const timeOptions = { timeZone: 'Asia/Bangkok', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    clockEl.innerText = `[ TIME: ${timeString} ]`;

    // 2. จัดการส่วนวันที่ (Date)
    const dateOptions = { timeZone: 'Asia/Bangkok', day: '2-digit', month: '2-digit', year: 'numeric' };
    const dateString = now.toLocaleDateString('en-GB', dateOptions); // จะได้รูปแบบ DD/MM/YYYY
    dateEl.innerText = `[ DATE: ${dateString} ]`;
}

// ==========================================
// 4. เริ่มต้นระบบ (Intro Screen)
// ==========================================
async function initSystem() {
    document.getElementById("device-display").innerText = navigator.platform + " [" + navigator.userAgent.substring(0, 15) + "...]";
    playBeep(400, 0.1);

    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        
        // 🌟 ระบบเซนเซอร์ IP (โชว์แค่ 2 ชุดแรก ที่เหลือเป็น ***)
        const ipParts = data.ip.split('.');
        if (ipParts.length === 4) {
            // สำหรับ IPv4 (เช่น 192.168.1.1 -> 192.168.***.***)
            document.getElementById("ip-display").innerText = `${ipParts[0]}.${ipParts[1]}.***.***`;
        } else {
            // เผื่อคนใช้ IPv6 ก็เซนเซอร์แบบเดียวกัน
            document.getElementById("ip-display").innerText = data.ip.substring(0, 8) + ":***:***";
        }
        
        playBeep(500, 0.1);
    } catch {
        document.getElementById("ip-display").innerText = "192.168.***.***";
    }

    loadYouTubeIframeAPI();
}
window.onload = initSystem;

// ==========================================
// 5. YouTube Music Player (Full Option)
// ==========================================
function loadYouTubeIframeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    // ดึงค่าเริ่มต้นจาก Dropdown (ถ้ามี)
    const playlistDropdown = document.getElementById('playlist-selector');
    const defaultList = playlistDropdown ? playlistDropdown.value : 'PL8HWkXHyCIuhVW-4-OGDhAusZAuPvQvtQ';

    player = new YT.Player('yt-player', {
        height: '0', width: '0',
        playerVars: {
            'listType': 'playlist',
            'list': defaultList, 
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
    
    // ป้องกันเสียงดังลั่น: ล็อกระดับเสียงตามหลอด Slider ตอนเริ่ม
    const volSlider = document.getElementById("volume-slider");
    if(volSlider) player.setVolume(volSlider.value);

    const apiStatus = document.getElementById("api-status");
    apiStatus.innerText = "> AUDIO_SERVER_CONNECTED";
    apiStatus.classList.replace("text-warning", "text-success");
    
    setTimeout(() => {
        document.getElementById("enter-btn").classList.remove("d-none");
        playBeep(800, 0.2);
    }, 800);
}

// แปลงเวลาเป็น นาที:วินาที
function formatTime(seconds) {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function onPlayerStateChange(event) {
    const playIcon = document.querySelector("#play-btn i");
    const titleEl = document.getElementById("song-title");
    const progressBar = document.getElementById("progress-bar");
    const totalTimeEl = document.getElementById("total-time");
    const currentTimeEl = document.getElementById("current-time");

    if (event.data == YT.PlayerState.PLAYING) {
        if(playIcon) playIcon.className = "fas fa-pause";
        
        // อัปเดตชื่อเพลง (ใส่ลงในกรอบ Marquee Smooth)
        let videoData = player.getVideoData();
        if(videoData && videoData.title && titleEl) {
            titleEl.innerText = videoData.title;
        }

        // ย้ำระดับเสียงอีกรอบกันบั๊ก
        const volSlider = document.getElementById("volume-slider");
        if(volSlider) player.setVolume(volSlider.value);

        // จัดการแถบเลื่อน (Seek Bar)
        if(progressBar && totalTimeEl && currentTimeEl) {
            progressBar.max = player.getDuration();
            totalTimeEl.innerText = formatTime(player.getDuration());

            clearInterval(progressInterval);
            progressInterval = setInterval(() => {
                if (!progressBar.dataset.dragging) {
                    progressBar.value = player.getCurrentTime();
                    currentTimeEl.innerText = formatTime(player.getCurrentTime());
                }
            }, 1000);
        }
    } else if (event.data == YT.PlayerState.PAUSED) {
        if(playIcon) playIcon.className = "fas fa-play";
        clearInterval(progressInterval);
        if(titleEl) titleEl.innerText = "[ PAUSED ]";
    }
}

// ควบคุมปุ่มต่างๆ
document.getElementById("play-btn").addEventListener("click", () => {
    if(!isPlayerReady) return;
    if(player.getPlayerState() == YT.PlayerState.PLAYING) player.pauseVideo();
    else player.playVideo();
});
document.getElementById("next-btn").addEventListener("click", () => { if(isPlayerReady) player.nextVideo(); });
document.getElementById("prev-btn").addEventListener("click", () => { if(isPlayerReady) player.previousVideo(); });

// ==========================================
// ระบบจัดการ Playlist & Cooldown (ดีที่สุด)
// ==========================================
let lastPlaylistChange = 0; // เก็บเวลาที่เปลี่ยนล่าสุด (Timestamp)
const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 นาที (ในหน่วยมิลลิวินาที)

const dropdownHeader = document.getElementById("dropdown-header");
const dropdownList = document.getElementById("dropdown-list");
const selectedText = document.getElementById("selected-playlist-text");
const dropdownItems = document.querySelectorAll(".dropdown-item");

// ฟังก์ชันสร้าง Toast แจ้งเตือนระบบ (ถ้าคุณมีฟังก์ชัน showToast อยู่แล้วให้ใช้ของเดิมได้)
function showSystemToast(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = "pixel-toast";
    if (isError) toast.style.backgroundColor = "#ff0000"; // สีแดงถ้าเป็น Error
    toast.innerHTML = `[ SYSTEM ]: ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

if(dropdownHeader && dropdownList) {
    dropdownHeader.addEventListener("click", () => {
        dropdownList.classList.toggle("d-none");
        playBeep(900, 0.05, 0.1); 
    });

    dropdownItems.forEach(item => {
        item.addEventListener("click", (e) => {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastPlaylistChange;

            // --- เช็คระบบ Cooldown ---
            if (timeDiff < COOLDOWN_DURATION) {
                const remainingSecs = Math.ceil((COOLDOWN_DURATION - timeDiff) / 1000);
                const mins = Math.floor(remainingSecs / 60);
                const secs = remainingSecs % 60;
                
                showSystemToast(`ACCESS DENIED! COOLDOWN ACTIVE: ${mins}m ${secs}s REMAINING`, true);
                dropdownList.classList.add("d-none");
                return; // หยุดการทำงาน ไม่ให้เปลี่ยนเพลง
            }

            // --- ถ้าผ่าน Cooldown ให้เริ่มเปลี่ยน Playlist ---
            const selectedValue = e.target.getAttribute("data-value").trim(); 
            const selectedName = e.target.innerText;

            selectedText.innerText = selectedName;
            dropdownList.classList.add("d-none");

            if(isPlayerReady && player) {
                // 1. อัปเดตเวลาการเปลี่ยนล่าสุด
                lastPlaylistChange = currentTime;

                // 2. ล้างค่าระบบเก่าให้หมด (เน้นความนิ่ง)
                player.stopVideo();
                player.setShuffle(false); // ปิดสุ่มถาวรตามคำขอ

                // 3. โหลด Playlist ใหม่แบบคลีนๆ
                player.loadPlaylist({
                    list: selectedValue,
                    listType: 'playlist',
                    index: 0
                });

                showSystemToast(`PLAYLIST LOADED: ${selectedName}`);
                playBeep(1200, 0.1, 0.2);
            }
        });
    });
}

// ระบบเลื่อน Slider ปรับเสียง
const volumeSlider = document.getElementById("volume-slider");
if(volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
        if(!isPlayerReady) return;
        player.setVolume(e.target.value);
    });
}

// ระบบเลื่อน Slider เพื่อกรอเพลง (Seek Bar)
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
if(progressBar && currentTimeEl) {
    progressBar.addEventListener("mousedown", () => progressBar.dataset.dragging = true);
    progressBar.addEventListener("touchstart", () => progressBar.dataset.dragging = true);
    progressBar.addEventListener("input", (e) => {
        currentTimeEl.innerText = formatTime(e.target.value);
    });
    progressBar.addEventListener("mouseup", (e) => {
        progressBar.dataset.dragging = "";
        if(isPlayerReady) player.seekTo(e.target.value, true);
    });
    progressBar.addEventListener("touchend", (e) => {
        progressBar.dataset.dragging = "";
        if(isPlayerReady) player.seekTo(e.target.value, true);
    });
}

// ==========================================
// 6. แอนิเมชันตอนเข้าสู่ระบบ
// ==========================================
const dynamicWords = ["SYSTEM", "DEVELOPER", "CREATOR", "1688_CORE", "ACTIVE"];
let currentWordIndex = 0;

document.getElementById("enter-btn").addEventListener("click", () => {
    playBeep(1200, 0.3, 0.2);
    document.getElementById("intro-screen").classList.add("d-none");
    document.getElementById("main-screen").classList.remove("d-none");
    document.getElementById("main-screen").classList.add("d-flex");
    
    // 🌟 โชว์ปุ่มแฮมเบอร์เกอร์เมื่อเข้าสู่หน้าหลัก
    const systemMenuBtn = document.getElementById("system-menu-btn");
    if(systemMenuBtn) systemMenuBtn.classList.remove("d-none");

    const bgVideo = document.getElementById("bg-video");
    const bgOverlay = document.getElementById("video-overlay");
    if(bgVideo) bgVideo.classList.remove("d-none");
    if(bgOverlay) bgOverlay.classList.remove("d-none");

    startTypingName();
    startGreetingCycle();
    
    setInterval(updateClock, 1000);
    updateClock();
    setInterval(rotateDynamicText, 10000);

    // 🌟 ระบบเล่นเพลงตอนเริ่ม (ปิดสุ่ม เล่นตามลำดับ)
    if(isPlayerReady && player) {
        player.setShuffle(false); // บังคับปิดสุ่ม
        player.playVideo(); 
        showSystemToast("INITIALIZING AUDIO STREAM...");
    }
});

function startTypingName() {
    const nameStr = "FLUKKIEBOYY";
    // เปลี่ยนกลับเป็น main-name ให้ตรงกับไฟล์ HTML ของคุณ
    const nameEl = document.getElementById("main-name"); 
    if(!nameEl) return;
    
    nameEl.innerHTML = "";
    let i = 0;
    const typeInterval = setInterval(() => {
        nameEl.innerHTML += nameStr.charAt(i);
        playBeep(700, 0.02);
        i++;
        if (i >= nameStr.length) clearInterval(typeInterval);
    }, 150);
}

function rotateDynamicText() {
    const textEl = document.getElementById("dynamic-text");
    if(!textEl) return;
    
    currentWordIndex = (currentWordIndex + 1) % dynamicWords.length;
    const newWord = dynamicWords[currentWordIndex];
    
    // อัปเดตแท็บเบราว์เซอร์
    document.title = `FLUKKIEBOYY | ${newWord}`;
    
    let currentContent = textEl.innerText;
    let length = currentContent.length;
    
    // ขาลง (ลบ)
    const backspaceInterval = setInterval(() => {
        textEl.innerText = currentContent.substring(0, length - 1);
        length--;
        if(length <= 0) {
            clearInterval(backspaceInterval);
            // ขาขึ้น (พิมพ์ใหม่)
            let i = 0;
            const typeInterval = setInterval(() => {
                textEl.innerText += newWord.charAt(i);
                playBeep(800, 0.02);
                i++;
                if(i >= newWord.length) clearInterval(typeInterval);
            }, 100);
        }
    }, 50);
}

function startGreetingCycle() {
    const greetings = ["สวัสดีคนแปลกหน้า", "ยินดีที่ได้รู้จัก", "SYSTEM CONNECTED"];
    const greetEl = document.getElementById("greeting-text");
    if(!greetEl) return;

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

// ==========================================
// 7. ระบบ Copy Discord Username
// ==========================================
document.getElementById("discord-btn").addEventListener("click", () => {
    const discordUsername = "morichyy";
    
    navigator.clipboard.writeText(discordUsername).then(() => {
        playBeep(900, 0.1, 0.1);
        const toast = document.getElementById("copy-toast");
        if(toast) {
            toast.classList.remove("d-none");
            setTimeout(() => {
                toast.classList.add("d-none");
            }, 2500);
        }
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
});

// ==========================================
// 8. ระบบ DONATE & DISCORD WEBHOOK 
// ==========================================
const DISCORD_WEBHOOK_URL = "";

// ดักจับการคลิกทั้งหน้าจอ หาตัวที่ตรงกับปุ่ม
document.addEventListener("click", function(e) {
    // 1. ตรวจสอบว่าคลิกโดนปุ่มเปิด Donate หรือไม่
    const openBtn = e.target.closest("#donate-btn");
    if (openBtn) {
        e.preventDefault();
        const modal = document.getElementById("donate-modal");
        if (modal) {
            modal.classList.remove("d-none");
            try { if(typeof playBeep === "function") playBeep(800, 0.1, 0.1); } catch(err){}
        } else {
            alert("[SYSTEM ERROR]: หาโค้ดหน้าต่าง Donate ไม่เจอ! ตรวจสอบในไฟล์ HTML ครับ");
        }
    }

    // 2. ตรวจสอบว่าคลิกโดนปุ่มปิด (X) หรือไม่
    const closeBtn = e.target.closest("#close-donate");
    if (closeBtn) {
        e.preventDefault();
        const modal = document.getElementById("donate-modal");
        if (modal) {
            modal.classList.add("d-none");
            try { if(typeof playBeep === "function") playBeep(600, 0.1, 0.1); } catch(err){}
        }
    }
});

// ส่วนของปุ่ม SUBMIT (เวอร์ชันวิเคราะห์สลิปแนวตั้ง + จำลองระบบ)
const submitDonate = document.getElementById("submit-donate");
const slipFile = document.getElementById("slip-file");

if(submitDonate) {
    submitDonate.addEventListener("click", () => {
        const file = slipFile.files[0];
        if(!file) {
            showSystemToast("ERROR: PLEASE UPLOAD A SLIP FIRST", true);
            return;
        }

        // 1. เช็คว่าเป็นไฟล์รูปภาพจริงๆ ใช่ไหม (กันคนเปลี่ยนนามสกุลไฟล์)
        if (!file.type.startsWith("image/")) {
            showSystemToast("ERROR: INVALID FILE TYPE", true);
            return;
        }

        // เปลี่ยนสถานะปุ่มตอนกำลังประมวลผล
        submitDonate.innerText = "SCANNING SLIP...";
        submitDonate.disabled = true;
        try { if(typeof playBeep === "function") playBeep(1000, 0.2, 0.1); } catch(err){}

        // 2. ใช้ FileReader เพื่อโหลดรูปมาวิเคราะห์สัดส่วน (Width x Height)
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // คำนวณอัตราส่วน (ความสูง หาร ความกว้าง)
                const ratio = this.height / this.width;
                
                // สลิปมือถือส่วนใหญ่ จะมีความสูงมากกว่าความกว้างอย่างน้อย 1.5 เท่าขึ้นไป
                if (ratio < 1.3) {
                    // ถ้ารูปเป็นแนวนอน หรือจัตุรัส (ratio น้อยกว่า 1.3) -> ตีเป็นรูปปลอม/รูปมั่ว!
                    try { if(typeof playBeep === "function") playBeep(300, 0.5, 0.2); } catch(err){} // เสียง Error ต่ำๆ
                    showSystemToast("WARNING: INVALID SLIP DIMENSIONS DETECTED!", true);
                    submitDonate.innerText = "SUBMIT_SLIP";
                    submitDonate.disabled = false;
                    return; // เตะออก ไม่ให้ผ่าน
                }

                // ถ้าผ่านเงื่อนไขความสูง (ถือว่าเป็นรูปสลิปแนวตั้ง) -> จำลองการอัปโหลดสำเร็จ
                setTimeout(() => {
                    try { if(typeof playBeep === "function") playBeep(1500, 0.3, 0.2); } catch(err){}
                    showSystemToast("SLIP VERIFIED & ACCEPTED. THANK YOU!");
                    
                    // รออีก 2 วินาทีแล้วปิดหน้าต่าง รีเซ็ตค่า
                    setTimeout(() => {
                        document.getElementById("donate-modal").classList.add("d-none");
                        submitDonate.innerText = "SUBMIT_SLIP";
                        submitDonate.disabled = false;
                        slipFile.value = ""; 
                    }, 2000);
                    
                }, 1500); // ดีเลย์จำลองการตรวจเช็ค 1.5 วิ
            };
            img.src = e.target.result;
        };
        // สั่งให้อ่านไฟล์
        reader.readAsDataURL(file);
    });
}

// ==========================================
// 9. ระบบ HAMBURGER MENU & IPTV SECURITY
// ==========================================
const menuBtn = document.getElementById("system-menu-btn");
const sidebar = document.getElementById("system-sidebar");
const closeSidebarBtn = document.getElementById("close-sidebar");

const menuIptvBtn = document.getElementById("menu-iptv");
const iptvModal = document.getElementById("iptv-modal");
const closeIptvModalBtn = document.getElementById("close-iptv-modal");
const verifyIptvBtn = document.getElementById("verify-iptv-btn");
const iptvPassInput = document.getElementById("iptv-password");

// ==========================================
// ระบบ Submenu ของ ARCHIVE_WORKS
// ==========================================
const menuPortfolioBtn = document.getElementById("menu-portfolio");
const archiveSubmenu = document.getElementById("archive-submenu");
const archiveChevron = document.getElementById("archive-chevron");

if(menuPortfolioBtn && archiveSubmenu) {
    menuPortfolioBtn.addEventListener("click", () => {
        // สลับโชว์/ซ่อน เมนูย่อย
        archiveSubmenu.classList.toggle("d-none");
        
        // สลับไอคอนลูกศร ขึ้น/ลง
        if(archiveChevron) {
            archiveChevron.classList.toggle("fa-chevron-down");
            archiveChevron.classList.toggle("fa-chevron-up");
        }
        
        // เสียงเวลากดโฟลเดอร์
        try { if(typeof playBeep === "function") playBeep(850, 0.05, 0.1); } catch(err){}
    });
}

// 1. เปิด/ปิด เมนู Sidebar
if(menuBtn) {
    menuBtn.addEventListener("click", () => {
        sidebar.classList.remove("d-none");
        try { if(typeof playBeep === "function") playBeep(800, 0.1, 0.1); } catch(err){}
    });
}
if(closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", () => {
        sidebar.classList.add("d-none");
        try { if(typeof playBeep === "function") playBeep(600, 0.1, 0.1); } catch(err){}
    });
}

// 2. กดปุ่ม IPTV เพื่อเปิดหน้าต่างใส่รหัส
if(menuIptvBtn) {
    menuIptvBtn.addEventListener("click", () => {
        iptvModal.classList.remove("d-none");
        sidebar.classList.add("d-none"); // พับเก็บเมนูหลักไปเลย
        iptvPassInput.value = ""; // เคลียร์ช่องใส่รหัส
        iptvPassInput.focus();
        try { if(typeof playBeep === "function") playBeep(900, 0.1, 0.1); } catch(err){}
    });
}

// 3. ปิดหน้าต่างใส่รหัส IPTV
if(closeIptvModalBtn) {
    closeIptvModalBtn.addEventListener("click", () => {
        iptvModal.classList.add("d-none");
        try { if(typeof playBeep === "function") playBeep(500, 0.1, 0.1); } catch(err){}
    });
}

// 4. ระบบตรวจรหัสผ่าน IPTV (Security Check)
// 4. ระบบตรวจรหัสผ่าน IPTV (Security Check)
if(verifyIptvBtn) {
    verifyIptvBtn.addEventListener("click", () => {
        // 🔒 รหัสผ่านของคุณ (ตอนนี้ตั้งไว้เป็น 1688)
        const secretCode = "1688"; 
        
        if (iptvPassInput.value === secretCode) {
            
            // 🌟 ท่าไม้ตาย: แอบฝังกุญแจชั่วคราว (Token) ไว้ใน Session ของเบราว์เซอร์
            sessionStorage.setItem("iptv_auth_token", "access_granted_1688");

            try { if(typeof playBeep === "function") playBeep(1500, 0.2, 0.2); } catch(err){}
            showSystemToast("ACCESS GRANTED. REDIRECTING...");
            
            // รอ 1 วินาทีแล้วเด้งไปหน้าใหม่
            setTimeout(() => {
                window.location.href = "WATCH_.html"; 
            }, 1000);
        } else {
            // ถ้ารหัสผิด
            try { if(typeof playBeep === "function") playBeep(300, 0.4, 0.2); } catch(err){}
            showSystemToast("ERROR: INVALID ACCESS CODE", true);
            iptvPassInput.value = ""; // เคลียร์ช่องให้กรอกใหม่
        }
    });

    // เพิ่มความสะดวก: กดปุ่ม Enter ในช่องรหัสผ่านได้เลย
    if(iptvPassInput) {
        iptvPassInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                verifyIptvBtn.click();
            }
        });
    }
}

// คำสั่งควบคุมการเปิด-ปิดโฟลเดอร์ QTCherry (พร้อมเสียง)
const qtCherryBtn = document.getElementById('qt-cherry-folder-btn');
const qtCherryContent = document.getElementById('qt-cherry-content');

if (qtCherryBtn) {
    qtCherryBtn.addEventListener('click', (e) => {
        // ป้องกันไม่ให้การคลิกไปกระทบกับเมนูหลัก
        e.stopPropagation(); 
        
        // 🎵 เล่นเสียงตอนกด (ใช้ฟังก์ชัน playBeep ที่คุณมีอยู่แล้ว)
        // ตั้งความถี่ที่ 800Hz ให้เสียงดูป๊อปอัพขึ้นมาหน่อย
        try { 
            if(typeof playBeep === "function") playBeep(800, 0.05, 0.1); 
        } catch(err){}
        
        // สลับการแสดงผล
        qtCherryContent.classList.toggle('d-none');
        
        // เปลี่ยนไอคอน folder ตอนเปิด/ปิด
        const icon = qtCherryBtn.querySelector('i');
        if (qtCherryContent.classList.contains('d-none')) {
            icon.className = 'fas fa-folder';
        } else {
            icon.className = 'fas fa-folder-open';
        }
    });
}
