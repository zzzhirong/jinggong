/* ---------- 页面切换 ---------- */
const $ = id => document.getElementById(id);
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.page === name));
  window.scrollTo(0, 0);
}
document.querySelectorAll('.tab').forEach(t => t.onclick = () => showPage(t.dataset.page));

/* ---------- 计时器 ---------- */
const clock = $('clock'), statusEl = $('status');
const ring = $('ring'), dial = document.querySelector('.dial');
const CIRC = 2 * Math.PI * 90;
let curMin = 15, totalSec = 15 * 60, endAt = 0, remainSec = totalSec, timerId = null, running = false, wakeLock = null;
let musicOn = true, ytFrame = null, ytState = -1;

// 分钟数 -> 静坐音乐的 YouTube ID（来自 data.js 里的“静坐音乐”）
const MUSIC = {}, LABELS = {};
CATEGORIES.find(c => c.id === 'jingzuo').items.forEach(i => { MUSIC[i.minutes] = i.youtube; LABELS[i.minutes] = i.label; });

const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

function setMinutes(m) {
  curMin = m;
  totalSec = remainSec = m * 60;
  $('sliderLabel').textContent = m + ' 分钟';
  $('pickLabel').textContent = LABELS[m] ? '（' + LABELS[m] + '）' : '';
  clock.textContent = fmt(totalSec);
  ring.style.strokeDashoffset = 0;
  document.querySelectorAll('#quick button').forEach(b => b.classList.toggle('on', +b.dataset.m === m));
}
// 计时按钮：只显示 data.js 里写了 label（功效）的静坐音乐
CATEGORIES.find(c => c.id === 'jingzuo').items.filter(i => i.label).sort((a, b) => a.minutes - b.minutes).forEach(i => {
  const m = i.minutes;
  const b = document.createElement('button');
  b.innerHTML = `<span class="qm">${m}分钟</span><span class="ql">${i.label}</span>`; b.dataset.m = m;
  b.onclick = () => { if (!running) setMinutes(m); };
  $('quick').appendChild(b);
});
function setMusic(on) {
  musicOn = on;
  $('musicToggle').classList.toggle('on', on);
  $('musicToggle').textContent = on ? '🎵 配乐：开' : '🔇 配乐：关';
}
$('musicToggle').onclick = () => { if (!running) setMusic(!musicOn); };

/* 配乐（YouTube 播放器，用消息控制 暂停/继续/停止） */
function ytCmd(func) {
  if (ytFrame && ytFrame.contentWindow)
    ytFrame.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: '' }), '*');
}
function startMusic() {
  const id = MUSIC[curMin];
  if (!musicOn || !id) return;
  $('musicSlot').innerHTML = `<div class="player audio"><iframe id="ytFrame" src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&rel=0&playsinline=1&enablejsapi=1" allow="autoplay; encrypted-media"></iframe></div>`;
  ytFrame = $('ytFrame'); ytState = -1;
  ytFrame.onload = () => ytFrame && ytFrame.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1 }), '*');
  $('musicBox').hidden = false; $('musicHint').hidden = true;
  $('musicSlot').classList.remove('reveal');
  updateBar();
  // 如果手机不让自动播放，就把播放器露出来，请妈妈点一下
  setTimeout(() => {
    if (running && ytFrame && ytState !== 1) { $('musicSlot').classList.add('reveal'); $('musicHint').hidden = false; }
  }, 4000);
}
function stopMusic() {
  ytCmd('stopVideo');
  $('musicSlot').innerHTML = ''; $('musicSlot').classList.remove('reveal'); ytFrame = null;
  $('musicBox').hidden = true;
}
// 监听 YouTube 播放状态（1 = 正在播放）
window.addEventListener('message', e => {
  if (!/youtube/.test(e.origin)) return;
  try {
    const d = JSON.parse(e.data);
    const st = d.info && (d.info.playerState !== undefined ? d.info.playerState : undefined);
    if (st !== undefined) {
      ytState = st;
      if (st === 1) { $('musicSlot').classList.remove('reveal'); $('musicHint').hidden = true; }
    }
  } catch (_) {}
});
// 进度条（走完整个计时时间）
function updateBar() {
  const done = totalSec - remainSec, pct = Math.max(0, Math.min(100, done / totalSec * 100));
  $('mFill').style.width = pct + '%';
  $('mKnob').style.left = pct + '%';
  $('mTime').textContent = fmt(done) + ' / ' + fmt(totalSec);
}

function bell() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 2.5, 5].forEach(t => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 528;
      o.connect(g); g.connect(ctx.destination);
      const s = ctx.currentTime + t;
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(0.7, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 2.4);
      o.start(s); o.stop(s + 2.5);
    });
  } catch (e) {}
  if (navigator.vibrate) navigator.vibrate([400, 200, 400, 200, 400]);
}

async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    else if (wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (running && document.visibilityState === 'visible') { keepAwake(true); tick(); } });

function tick() {
  remainSec = Math.max(0, Math.round((endAt - Date.now()) / 1000));
  clock.textContent = fmt(remainSec);
  ring.style.strokeDashoffset = CIRC * (1 - remainSec / totalSec);
  if (ytFrame) updateBar();
  if (remainSec <= 0) finish();
}
function finish() {
  clearInterval(timerId); running = false; keepAwake(false);
  stopMusic();
  dial.classList.add('done');
  statusEl.textContent = '时间到，请缓缓收功 🙏';
  $('btnStart').textContent = '再来一次'; $('btnStart').hidden = false;
  $('btnReset').hidden = true;
  $('sliderBox').classList.remove('locked');
  bell();
}
function start() {
  const fresh = remainSec <= 0 || dial.classList.contains('done') || remainSec === totalSec;
  if (remainSec <= 0 || dial.classList.contains('done')) { dial.classList.remove('done'); setMinutes(curMin); }
  // 在点击时先“唤醒”声音，手机才允许之后响铃
  try { const c = new (window.AudioContext || window.webkitAudioContext)(); c.resume(); c.close(); } catch (e) {}
  running = true; endAt = Date.now() + remainSec * 1000;
  timerId = setInterval(tick, 500);
  if (fresh) startMusic(); else ytCmd('playVideo');
  statusEl.textContent = '练功中…请放松';
  $('btnStart').textContent = '暂 停';
  $('btnReset').hidden = false;
  $('sliderBox').classList.add('locked');
  keepAwake(true);
}
function pause() {
  clearInterval(timerId); running = false; keepAwake(false);
  tick(); ytCmd('pauseVideo'); statusEl.textContent = '已暂停';
  $('btnStart').textContent = '继 续';
}
$('btnStart').onclick = () => running ? pause() : start();
$('btnReset').onclick = () => {
  clearInterval(timerId); running = false; keepAwake(false);
  stopMusic();
  dial.classList.remove('done');
  setMinutes(curMin);
  statusEl.textContent = '请选择时间';
  $('btnStart').textContent = '开 始';
  $('btnReset').hidden = true;
  $('sliderBox').classList.remove('locked');
};
setMinutes(15);

/* ---------- 功法引导 ---------- */
const catGrid = $('catGrid');
CATEGORIES.forEach(c => {
  const b = document.createElement('button');
  b.className = 'cat';
  b.innerHTML = `<div class="ic">${c.icon}</div><div class="nm">${c.name}</div><div class="ds">${c.desc}</div>`;
  b.onclick = () => openCategory(c);
  catGrid.appendChild(b);
});

function searchUrl(it) {
  const q = encodeURIComponent(it.search);
  return it.site === 'bilibili'
    ? 'https://search.bilibili.com/all?keyword=' + q
    : 'https://www.youtube.com/results?search_query=' + q;
}

function openCategory(c) {
  $('guideHome').hidden = true; $('guideList').hidden = false;
  $('listTitle').textContent = c.name;
  const box = $('items'); box.innerHTML = '';
  c.items.forEach(it => {
    const el = document.createElement('div'); el.className = 'item';
    el.innerHTML = `<div class="row"><span class="name">${it.title}</span><span class="tag">${it.type}</span></div>
                    <div class="note">${it.note || ''}</div><div class="btns"></div><div class="slot"></div>`;
    const btns = el.querySelector('.btns'), slot = el.querySelector('.slot');
    const add = (txt, cls, fn, href) => {
      const x = document.createElement(href ? 'a' : 'button');
      x.className = 'btn ' + cls; x.textContent = txt;
      if (href) { x.href = href; x.target = '_blank'; x.rel = 'noopener'; } else x.onclick = fn;
      btns.appendChild(x);
    };
    if (it.audio) {
      // 网站自带的录音文件
      add('▶ 开始收听', '', () => {
        document.querySelectorAll('#items audio').forEach(a => a.pause());
        slot.innerHTML = `<audio class="aud" controls preload="metadata" src="${it.audio}"></audio>`;
        slot.querySelector('audio').play().catch(() => {});
      });
    } else if (it.video) {
      // 网站自带的视频文件；长视频分成几段，会自动接着播放
      add('▶ 开始观看', '', () => {
        const parts = [].concat(it.video); let i = 0;
        slot.innerHTML = `<video class="vid" controls playsinline preload="metadata"></video><div class="fallback"></div>`;
        const v = slot.querySelector('video'), lab = slot.querySelector('.fallback');
        const load = () => {
          v.src = parts[i];
          lab.textContent = parts.length > 1 ? `第 ${i + 1} 段 / 共 ${parts.length} 段（会自动接着播放）` : '';
          v.play().catch(() => {});
        };
        v.onended = () => { if (i < parts.length - 1) { i++; load(); } };
        load();
      });
    } else if (it.youtube) {
      add(it.type === '音频' ? '▶ 开始收听' : '▶ 开始观看', '', () => {
        const audio = it.type === '音频';
        slot.innerHTML = `<div class="player ${audio ? 'audio' : ''}"><iframe src="https://www.youtube-nocookie.com/embed/${it.youtube}?autoplay=1&rel=0&playsinline=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe></div>
          <div class="fallback">看不了？<a href="https://www.youtube.com/watch?v=${it.youtube}" target="_blank" rel="noopener">点这里在 YouTube 打开</a></div>`;
      });
    } else if (it.bilibili) {
      add('▶ 开始观看', '', () => {
        slot.innerHTML = `<div class="player"><iframe src="https://player.bilibili.com/player.html?bvid=${it.bilibili}&autoplay=1" allowfullscreen></iframe></div>`;
      });
    } else if (it.link) {
      add('打开', '', null, it.link);
    } else if (it.search) {
      add('🔍 点这里找视频', '', null, searchUrl(it));
    }
    if (it.minutes) add('⏳ 用这个时间计时', 'alt', () => { if (running) return alert('计时正在进行，请先回到“计时”页点“重来”。'); setMinutes(it.minutes); setMusic(c.id === 'jingzuo'); showPage('timer'); });
    box.appendChild(el);
  });
  window.scrollTo(0, 0);
}
$('btnBack').onclick = () => { $('guideList').hidden = true; $('guideHome').hidden = false; $('items').innerHTML = ''; };
