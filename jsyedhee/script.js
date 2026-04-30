// เปลี่ยน ID เป็นของคุณและเพื่อน
const mainId = '603384047321743370'; 
const subId = '603384047321743370'; // ใส่ ID ของ pikminmi

// --- Customization: set a manual avatar image and options here ---
// You can hardcode a URL directly into the code by setting
// `CODE_MANUAL_AVATAR_URL`. If that is non-empty it will take
// precedence over any stored value in localStorage.
// Example: const CODE_MANUAL_AVATAR_URL = 'https://example.com/myavatar.png';
const CODE_MANUAL_AVATAR_URL = 'https://raw.githubusercontent.com/DeAlone05/mp3/main/d7.gif'; // <-- paste image URL here to hardcode it in code
// `manualAvatarUrl` uses the code URL first, then any saved localStorage value.
let manualAvatarUrl = CODE_MANUAL_AVATAR_URL || localStorage.getItem('manualAvatarUrl') || '';
const hideStatusIndicator = true; // set true to remove the small colored status dot

// --- Per-track thumbnail storage (saved in localStorage.manualMusicThumbs) ---
let manualMusicThumbs = {};
try { manualMusicThumbs = JSON.parse(localStorage.getItem('manualMusicThumbs') || '{}'); } catch(e){ manualMusicThumbs = {}; }

function getThumbForTrack(index) {
  const key = playlist[index] && playlist[index].name ? playlist[index].name : String(index);
  return manualMusicThumbs[key] || '';
}

function setThumbForTrack(index, url) {
  const key = playlist[index] && playlist[index].name ? playlist[index].name : String(index);
  manualMusicThumbs[key] = url;
  localStorage.setItem('manualMusicThumbs', JSON.stringify(manualMusicThumbs));
}

function removeThumbForTrack(index) {
  const key = playlist[index] && playlist[index].name ? playlist[index].name : String(index);
  delete manualMusicThumbs[key];
  localStorage.setItem('manualMusicThumbs', JSON.stringify(manualMusicThumbs));
}

// --- Image library (multiple links) saved in localStorage.imageLibrary as array ---
let imageLibrary = [];
function loadImageLibrary() {
  try { imageLibrary = JSON.parse(localStorage.getItem('imageLibrary') || '[]'); } catch(e){ imageLibrary = []; }
}
function saveImageLibrary() { localStorage.setItem('imageLibrary', JSON.stringify(imageLibrary)); }
function addImageToLibrary(url) {
  if (!url) return;
  if (!imageLibrary.includes(url)) {
    imageLibrary.push(url);
    saveImageLibrary();
  }
}
function removeImageFromLibrary(idx) {
  if (idx >=0 && idx < imageLibrary.length) {
    imageLibrary.splice(idx,1);
    saveImageLibrary();
  }
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = '';
  imageLibrary.forEach((url, i) => {
    const item = document.createElement('div'); item.className = 'gallery-item';
    const img = document.createElement('img'); img.src = url;
    const actions = document.createElement('div'); actions.className = 'gallery-actions';
    const assignBtn = document.createElement('button'); assignBtn.textContent = 'Use';
    assignBtn.addEventListener('click', () => { setThumbForTrack(currentIndex, url); const t = document.getElementById('music-thumb'); if(t) t.style.backgroundImage = `url('${url}')`; });
    const delBtn = document.createElement('button'); delBtn.textContent = 'Del';
    delBtn.addEventListener('click', () => { removeImageFromLibrary(i); renderGallery(); });
    actions.appendChild(assignBtn); actions.appendChild(delBtn);
    item.appendChild(img); item.appendChild(actions); grid.appendChild(item);
  });
}

function openGallery() {
  loadImageLibrary(); renderGallery();
  const modal = document.getElementById('gallery-modal'); if (modal) modal.style.display = 'flex';
}
function closeGallery() { const modal = document.getElementById('gallery-modal'); if (modal) modal.style.display = 'none'; }

// --- Debug helper: test loading of key images and log results to Console ---
function debugTestImages() {
  const tests = [];
  const bg = document.getElementById('bg-gif'); if (bg && bg.src) tests.push({label: 'bg-gif', url: bg.src});
  if (manualAvatarUrl) tests.push({label: 'manualAvatarUrl', url: manualAvatarUrl});
  const avatarEl = document.getElementById('avatar');
  if (avatarEl) {
    const bgStyle = (avatarEl.style.backgroundImage || '').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    if (bgStyle) tests.push({label: 'avatar.style', url: bgStyle});
  }
  if (imageLibrary && imageLibrary.length) tests.push({label: 'imageLibrary[0]', url: imageLibrary[0]});

  tests.forEach(t => {
    try {
      const img = new Image();
      img.onload = () => console.log('[IMG OK] ' + t.label + ' → ' + t.url);
      img.onerror = () => console.error('[IMG ERR] ' + t.label + ' → ' + t.url);
      // Start loading
      img.src = t.url;
    } catch (e) {
      console.error('[IMG TEST FAIL]', t.label, e);
    }
  });
}


const playlist = [
   { 
    name: "Confessing", 
    url: "https://raw.githubusercontent.com/Dogearth/mp3/main/Confessing.mp3",
    image: "https://raw.githubusercontent.com/DeAlone05/mp3/main/d8.gif"
  },
    { 
    name: "StarFall", 
    url: "https://raw.githubusercontent.com/Dogearth/mp3/main/WANYAi.mp3",
    image: "https://raw.githubusercontent.com/DeAlone05/mp3/main/d6.gif"
  },
  { 
    name: "LIKE DAMN", 
    url: "https://raw.githubusercontent.com/Dogearth/mp3/main/LIKE%20DAMN.mp3",
    image: "https://raw.githubusercontent.com/DeAlone05/mp3/main/d2.gif" // ใส่ลิงก์รูปตรงนี้
  },
  { 
    name: "Jigsaw Story", 
    url: "https://raw.githubusercontent.com/Dogearth/mp3/main/Jigsaw%20Story.mp3",
    image: "https://raw.githubusercontent.com/DeAlone05/mp3/main/d3.gif" 
  },
  { 
    name: "EGO", 
    url: "https://raw.githubusercontent.com/Dogearth/mp3/main/EGO.mp3",
    image: "https://raw.githubusercontent.com/DeAlone05/mp3/main/d4.gif"
  },
  { 
    name: "Loop", 
    url: "https://raw.githubusercontent.com/Dogearth/mp3/main/Loop.mp3",
    image: "https://raw.githubusercontent.com/DeAlone05/mp3/main/d5.gif"
  }

];

let currentIndex = 0;
let audio = new Audio();

// บังคับให้เป็น Global Function
window.enterSite = function() {
  const enterBtn = document.getElementById('enterBtn');
  const profile = document.getElementById('profile');
  const musicCard = document.getElementById('music-card');
  const volumeControl = document.getElementById('volume-control'); // ดึง ID ของปุ่มเสียงมา

  if(enterBtn) enterBtn.style.display = 'none';
  if(profile) profile.style.display = 'flex';
  if(musicCard) musicCard.style.display = 'flex';
  if(volumeControl) volumeControl.style.display = 'flex'; // สั่งให้แสดงผลตอนกด Enter

  playSong();
};

function playSong() {
  const currentTrack = playlist[currentIndex];
  audio.src = currentTrack.url;
  document.getElementById('song-name').textContent = currentTrack.name;

  // ดึง Element วงกลมรูปภาพ
  const thumbEl = document.getElementById('music-thumb');
  
  if (thumbEl) {
    // ตรวจสอบว่าใน playlist มีรูปภาพไหม ถ้ามีให้แสดง ถ้าไม่มีให้เป็นสีพื้นหลังว่างๆ
    if (currentTrack.image) {
      thumbEl.style.backgroundImage = `url('${currentTrack.image}')`;
      thumbEl.style.backgroundSize = 'cover';
      thumbEl.style.backgroundPosition = 'center';
    } else {
      thumbEl.style.backgroundImage = 'none';
      thumbEl.style.backgroundColor = '#222'; // สีสำรองถ้าไม่มีรูป
    }
    audio.onended = () => {
      playNext(); // เมื่อจบเพลงปัจจุบัน จะไปเรียก currentIndex ถัดไปแล้วเล่นใหม่ทันที
    };

    window.playNext = function() {
      currentIndex = (currentIndex + 1) % playlist.length;
      playSong();
    };
  }

  audio.play().catch(() => console.log("Interaction required to play audio"));
  document.getElementById('play-pause-icon').className = 'fas fa-pause';
}

window.togglePlay = function() {
  if (audio.paused) {
    audio.play();
    document.getElementById('play-pause-icon').className = 'fas fa-pause';
  } else {
    audio.pause();
    document.getElementById('play-pause-icon').className = 'fas fa-play';
  }
};

window.playNext = function() {
  currentIndex = (currentIndex + 1) % playlist.length;
  playSong();
};

window.playPrevious = function() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  playSong();
};

// อัปเดต Progress Bar
audio.ontimeupdate = () => {
  if (!isNaN(audio.duration)) {
    const prog = (audio.currentTime / audio.duration) * 100;
    document.getElementById('progress-fill').style.width = prog + '%';
    document.getElementById('current-time').textContent = formatTime(audio.currentTime);
    document.getElementById('duration').textContent = formatTime(audio.duration);
  }
};

function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

async function fetchProfiles() {
  try {
    const [res1, res2] = await Promise.all([
      fetch(`https://api.lanyard.rest/v1/users/${mainId}`).then(r => r.json()),
      fetch(`https://api.lanyard.rest/v1/users/${subId}`).then(r => r.json())
    ]);

    if (res1.success) {
      const d = res1.data;
      // If a manual avatar URL is set, use it instead of Discord avatar
      if (manualAvatarUrl) {
        document.getElementById('avatar').style.backgroundImage = `url('${manualAvatarUrl}')`;
      } else {
        const avatarUrl = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.${d.discord_user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=512`;
        document.getElementById('avatar').style.backgroundImage = `url('${avatarUrl}')`;
      }

      // Set username (still can come from Discord username)
      document.getElementById('username').textContent = d.discord_user.username;

      // Hide or set status indicator based on flag
      const si = document.getElementById('status-indicator');
      if (si) {
        if (hideStatusIndicator) si.style.display = 'none';
        else si.className = `status-indicator status-${d.discord_status}`;
      }
    }

    if (res2.success) {
      const d = res2.data;
      const subAvatar = d.discord_user.avatar ? `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=128` : `https://cdn.discordapp.com/embed/avatars/0.png`;
      document.getElementById('sub-avatar').style.backgroundImage = `url('${subAvatar}')`;

      // Replace the sub-profile name with a link to the Discord profile
      const subNameLink = document.getElementById('sub-name-link');
      if (subNameLink) {
        subNameLink.textContent = d.discord_user.username;
        subNameLink.href = `https://discord.com/users/${d.discord_user.id}`;
      }

      // Prefer showing what's currently playing (Spotify or active game) instead of raw status like DND
      let nowPlaying = '';
      if (d.listening_to_spotify && d.spotify) {
        nowPlaying = `Listening: ${d.spotify.song} — ${d.spotify.artist}`;
      } else {
        const activities = d.activities || [];
        const playAct = activities.find(a => a.type === 0 && a.name && a.name.toLowerCase() !== 'custom status');
        if (playAct) {
          nowPlaying = playAct.details ? `${playAct.name} — ${playAct.details}` : playAct.name;
        } else {
          nowPlaying = d.discord_status === 'offline' ? 'last seen recently' : d.discord_status.toUpperCase();
        }
      }

      document.getElementById('sub-status-text').textContent = nowPlaying;
      const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
      document.getElementById('sub-discord-icon').style.color = colors[d.discord_status] || colors.offline;
    }
  } catch (e) {
    console.error("API Error:", e);
  }
}

// เริ่มต้นระบบ
window.onload = () => {
  fetchProfiles();
  setInterval(fetchProfiles, 10000);
  initLanyardSocket();
  // wire gallery controls
  try {
    const openBtn = document.getElementById('open-gallery');
    const closeBtn = document.getElementById('close-gallery');
    const addUrlBtn = document.getElementById('gallery-add-url-btn');
    const addUrlInput = document.getElementById('gallery-add-url');
    const uploadFile = document.getElementById('gallery-upload-file');

    if (openBtn) openBtn.addEventListener('click', openGallery);
    if (closeBtn) closeBtn.addEventListener('click', closeGallery);

    if (addUrlBtn && addUrlInput) {
      addUrlBtn.addEventListener('click', () => {
        const u = (addUrlInput.value || '').trim();
        if (!u) return alert('Enter an image URL');
        addImageToLibrary(u); renderGallery(); addUrlInput.value = '';
      });
    }

    if (uploadFile) {
      uploadFile.addEventListener('change', (ev) => {
        const f = ev.target.files && ev.target.files[0]; if (!f) return;
        const r = new FileReader(); r.onload = (e) => { addImageToLibrary(e.target.result); renderGallery(); };
        r.readAsDataURL(f);
      });
    }
  } catch (e) { console.warn('Gallery init failed', e); }
  // Auto-run image diagnostics on load to help debugging
  try {
    console.log('Debug: imageLibrary=', JSON.parse(localStorage.getItem('imageLibrary') || '[]'));
    console.log('Debug: manualMusicThumbs=', JSON.parse(localStorage.getItem('manualMusicThumbs') || '{}'));
    setTimeout(debugTestImages, 400);
  } catch (e) { console.warn('Debug logs failed', e); }
};

// --- Real-time updates via Lanyard WebSocket ---
function initLanyardSocket() {
  try {
    const socket = new WebSocket('wss://api.lanyard.rest/socket');

    socket.addEventListener('open', () => {
      // Subscribe to both user IDs for real-time presence
      socket.send(JSON.stringify({ op: 2, d: { subscribe_to_ids: [mainId, subId] } }));
    });

    socket.addEventListener('message', (ev) => {
      try {
        const payload = JSON.parse(ev.data);

        // INIT_STATE may include an array or map of presences
        if (payload.t === 'INIT_STATE' && payload.d) {
          // payload.d may be an object with users or an array
          const data = payload.d;
          if (Array.isArray(data)) data.forEach(item => processPresencePayload(item));
          else if (data && data.presences) data.presences.forEach(item => processPresencePayload(item));
          else processPresencePayload(data);
        }

        // PRESENCE_UPDATE contains a single user's presence in d
        if (payload.t === 'PRESENCE_UPDATE' && payload.d) {
          processPresencePayload(payload.d);
        }
      } catch (e) {
        // ignore malformed messages
      }
    });

    socket.addEventListener('close', () => {
      // attempt reconnect after short delay
      setTimeout(initLanyardSocket, 5000);
    });
  } catch (e) {
    console.error('Lanyard socket init failed', e);
  }
}

function processPresencePayload(raw) {
  // Lanyard payload shape varies: sometimes { data: { ... } } or direct
  const d = raw.data ? raw.data : raw;
  if (!d || !d.discord_user) return;

  const id = d.discord_user.id;
  if (id === mainId) updateMainPresence(d);
  if (id === subId) updateSubPresence(d);
}

function updateMainPresence(d) {
  if (manualAvatarUrl) {
    document.getElementById('avatar').style.backgroundImage = `url('${manualAvatarUrl}')`;
  } else if (d.discord_user.avatar) {
    const avatarUrl = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.${d.discord_user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=512`;
    document.getElementById('avatar').style.backgroundImage = `url('${avatarUrl}')`;
  }

  document.getElementById('username').textContent = d.discord_user.username || document.getElementById('username').textContent;

  const si = document.getElementById('status-indicator');
  if (si) {
    if (hideStatusIndicator) si.style.display = 'none';
    else si.className = `status-indicator status-${d.discord_status}`;
  }
}

function updateSubPresence(d) {
  const subAvatar = d.discord_user.avatar ? `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=128` : `https://cdn.discordapp.com/embed/avatars/0.png`;
  document.getElementById('sub-avatar').style.backgroundImage = `url('${subAvatar}')`;

  const subNameLink = document.getElementById('sub-name-link');
  if (subNameLink) {
    subNameLink.textContent = d.discord_user.username || subNameLink.textContent;
    subNameLink.href = `https://discord.com/users/${d.discord_user.id}`;
  }

  // Compute now-playing preference: Spotify > activity > status
  let nowPlaying = '';
  if (d.listening_to_spotify && d.spotify) {
    nowPlaying = `Listening: ${d.spotify.song} — ${d.spotify.artist}`;
  } else {
    const activities = d.activities || [];
    const playAct = activities.find(a => a.type === 0 && a.name && a.name.toLowerCase() !== 'custom status');
    if (playAct) nowPlaying = playAct.details ? `${playAct.name} — ${playAct.details}` : playAct.name;
    else nowPlaying = d.discord_status === 'offline' ? 'last seen recently' : d.discord_status.toUpperCase();
  }

  document.getElementById('sub-status-text').textContent = nowPlaying;
  const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
  document.getElementById('sub-discord-icon').style.color = colors[d.discord_status] || colors.offline;
}

// Keyboard: spacebar toggles play/pause unless typing in inputs
window.addEventListener('keydown', (e) => {
  try {
    const active = document.activeElement;
    const tag = active && active.tagName ? active.tagName.toLowerCase() : null;
    const isTyping = tag === 'input' || tag === 'textarea' || (active && active.isContentEditable);
    if (isTyping) return;

    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      if (typeof window.togglePlay === 'function') window.togglePlay();
    }
  } catch (err) {
    // ignore
  }
});
// --- เพิ่มฟังก์ชันควบคุมเสียง ---

// ฟังก์ชันสำหรับตั้งค่าระดับเสียงจาก Slider
window.setVolume = function(val) {
  audio.volume = val;
};

// --- ฟังก์ชันควบคุมเสียง (เพิ่มต่อท้ายไฟล์) ---
window.setVolume = function(val) {
  audio.volume = val;
};

window.changeVolume = function(amount) {
  let newVol = audio.volume + amount;
  if (newVol > 1) newVol = 1;
  if (newVol < 0) newVol = 0;
  audio.volume = newVol;
  document.getElementById('volume-slider').value = newVol;
};

const card = document.querySelector(".profile");

document.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect();
  
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  card.style.setProperty("--x", x + "px");
  card.style.setProperty("--y", y + "px");

  const rotateX = (y - rect.height / 2) / 20;
  const rotateY = (rect.width / 2 - x) / 20;

  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.addEventListener("mouseleave", () => {
  card.style.transform = `rotateX(0deg) rotateY(0deg)`;
});







