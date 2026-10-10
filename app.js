/* ---------- 页面切换 ---------- */
const $ = id => document.getElementById(id);
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.page === name));
  window.scrollTo(0, 0);
}
document.querySelectorAll('.tab').forEach(t => t.onclick = () => showPage(t.dataset.page));

/* ---------- 计时器 ---------- */
const slider = $('slider'), clock = $('clock'), statusEl = $('status');
const ring = $('ring'), dial = document.querySelector('.dial');
const CIRC = 2 * Math.PI * 90;
let totalSec = 15 * 60, endAt = 0, remainSec = totalSec, timerId = null, running = false, wakeLock = null;

const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

function setMinutes(m) {
  m = Math.max(2, Math.min(60, m));
  slider.value = m;
  totalSec = remainSec = m * 60;
  $('sliderLabel').textContent = m + ' 分钟';
  clock.textContent = fmt(totalSec);
  ring.style.strokeDashoffset = 0;
  document.querySelectorAll('#quick button').forEach(b => b.classList.toggle('on', +b.dataset.m === m));
}
[5, 10, 15, 20, 30, 40, 45, 60].forEach(m => {
  const b = document.createElement('button');
  b.textContent = m + '分'; b.dataset.m = m;
  b.onclick = () => { if (!running) setMinutes(m); };
  $('quick').appendChild(b);
});
slider.oninput = () => { if (!running) setMinutes(+slider.value); };

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
  if (remainSec <= 0) finish();
}
function finish() {
  clearInterval(timerId); running = false; keepAwake(false);
  dial.classList.add('done');
  statusEl.textContent = '时间到，请缓缓收功 🙏';
  $('btnStart').textContent = '再来一次'; $('btnStart').hidden = false;
  $('btnReset').hidden = true;
  $('sliderBox').classList.remove('locked');
  bell();
}
function start() {
  if (remainSec <= 0 || dial.classList.contains('done')) { dial.classList.remove('done'); setMinutes(+slider.value); }
  // 在点击时先“唤醒”声音，手机才允许之后响铃
  try { const c = new (window.AudioContext || window.webkitAudioContext)(); c.resume(); c.close(); } catch (e) {}
  running = true; endAt = Date.now() + remainSec * 1000;
  timerId = setInterval(tick, 500);
  statusEl.textContent = '练功中…请放松';
  $('btnStart').textContent = '暂 停';
  $('btnReset').hidden = false;
  $('sliderBox').classList.add('locked');
  keepAwake(true);
}
function pause() {
  clearInterval(timerId); running = false; keepAwake(false);
  tick(); statusEl.textContent = '已暂停';
  $('btnStart').textContent = '继 续';
}
$('btnStart').onclick = () => running ? pause() : start();
$('btnReset').onclick = () => {
  clearInterval(timerId); running = false; keepAwake(false);
  dial.classList.remove('done');
  setMinutes(+slider.value);
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
    if (it.youtube) {
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
    if (it.minutes) add('⏳ 用这个时间计时', 'alt', () => { setMinutes(it.minutes); showPage('timer'); });
    box.appendChild(el);
  });
  window.scrollTo(0, 0);
}
$('btnBack').onclick = () => { $('guideList').hidden = true; $('guideHome').hidden = false; $('items').innerHTML = ''; };
