const userId = '603384047321743370'; // Discord User ID

function fetchProfile() {
  fetch(`https://api.lanyard.rest/v1/users/${userId}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data.success) throw new Error("API ไม่ตอบสนอง");

      const d = data.data;
      const username = `${d.discord_user.username}${d.discord_user.discriminator}`;
      let status = d.discord_status;

      
      const isActive =
        d.active_on_discord_desktop ||
        d.active_on_discord_web ||
        d.active_on_discord_mobile;

      if (!isActive) {
        status = "offline";
      }

      let avatarUrl = '';
      if (d.discord_user.avatar) {
        const isAnimated = d.discord_user.avatar.startsWith('a_');
        const ext = isAnimated ? 'gif' : 'png';
        avatarUrl = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.${ext}?size=512`;
      } else {
        const index = parseInt(d.discord_user.discriminator) % 5;
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${index}.png`;
      }

      const statusEmojiMap = {
        online: "🟢",
        idle: "🌙",
        dnd: "⛔",
        offline: "⚫"
      };

      const statusTextMap = {
        online: "ออนไลน์",
        idle: "ไม่ว่าง",
        dnd: "ห้ามรบกวน",
        offline: "ออฟไลน์"
      };

      const fullStatus = `${statusEmojiMap[status] || "❔"} ${statusTextMap[status] || "ไม่ทราบสถานะ"}`;

      // แสดงผล
      document.getElementById('username').textContent = username;
      document.getElementById('status').textContent = fullStatus;
      document.getElementById('avatar').style.backgroundImage = `url('${avatarUrl}')`;

      // สีวงกลมสถานะ
      const statusIndicator = document.getElementById('status-indicator');
      statusIndicator.className = 'status-indicator'; // reset class
      switch (status) {
        case 'online':
          statusIndicator.classList.add('status-online');
          break;
        case 'idle':
          statusIndicator.classList.add('status-idle');
          break;
        case 'dnd':
          statusIndicator.classList.add('status-dnd');
          break;
        default:
          statusIndicator.classList.add('status-offline');
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById('username').textContent = 'ไม่สามารถโหลดโปรไฟล์';
      document.getElementById('status').textContent = '';
    });
}

function enterSite() {
  document.querySelector('.enter-btn').style.display = 'none';
  document.getElementById('profile').style.display = 'flex';

  const audio = document.getElementById('myAudio');
  audio.volume = 0.1;
  audio.play().catch(err => console.warn('เล่นเพลงไม่ได้:', err));


  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  });

  fetchProfile(); 
  setInterval(fetchProfile, 1000); 
}
