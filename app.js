/* NFC profile — shared core: link catalog, safe rendering, storage, page effects.
   Used by index.html (public page) and edit.html (editor). */
(function () {
  'use strict';
  var CFG = window.NFC_CONFIG || {};

  /* ------------------------------------------------------------------ icons */
  var ICONS = {"whatsapp": "<path d=\"M4 20l1.3-3.9A8 8 0 1 1 8 19z\"/><path d=\"M9 9.5c.3 2.2 2.3 4.2 4.5 4.5\"/>", "linkedin": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4\"/><path d=\"M8 10.5V16M8 7.8v.01M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3\"/>", "github": "<path d=\"M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.6 4.7 4.7 0 0 0-.1-3.6s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C6 1 4.9 1.3 4.9 1.3a4.7 4.7 0 0 0-.1 3.6A5 5 0 0 0 3.4 8.5c0 5.1 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V21\"/>", "instagram": "<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"17\" cy=\"7\" r=\".9\" fill=\"currentColor\"/>", "tiktok": "<path d=\"M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5\"/><path d=\"M14 4c.5 2.5 2.2 4 5 4.2\"/>", "facebook": "<path d=\"M15 4h-2a3 3 0 0 0-3 3v13\"/><path d=\"M7 11h7\"/>", "spotify": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M7.5 9.5c3-1 6.5-.7 9 .8M8 12.7c2.5-.7 5.2-.4 7.3.8M8.6 15.6c1.9-.5 3.9-.3 5.5.6\"/>", "mail": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"3\"/><path d=\"M4 7l8 6 8-6\"/>", "phone": "<path d=\"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z\"/>", "code": "<path d=\"M8 7l-5 5 5 5M16 7l5 5-5 5\"/>", "scale": "<path d=\"M12 3v18M6 21h12M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z\"/>", "telegram": "<path d=\"M21 4L3 11l6 2.5M21 4l-3 16-9-6.5M21 4L9 13.5V19l3-3.2\"/>", "instapay": "<path d=\"M13 3L5 13.5h6L10 21l8-10.5h-6z\"/>", "telda": "<rect x=\"2.5\" y=\"5\" width=\"19\" height=\"14\" rx=\"3\"/><path d=\"M2.5 9.5h19M6.5 15h4\"/>", "x": "<path d=\"M4 4l16 16M20 4L4 20\"/>", "youtube": "<rect x=\"2.5\" y=\"5.5\" width=\"19\" height=\"13\" rx=\"4\"/><path d=\"M10 9.5v5l4.5-2.5z\" fill=\"currentColor\"/>", "snapchat": "<path d=\"M12 3c3 0 5 2.2 5 5v3l2 1-2 1c.3 1.7 1.8 2.8 3 3-1 .8-2.3 1-3.5 1-.8 1.3-2.2 2-4.5 2s-3.7-.7-4.5-2c-1.2 0-2.5-.2-3.5-1 1.2-.2 2.7-1.3 3-3l-2-1 2-1V8c0-2.8 2-5 5-5z\"/>", "website": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c2.5 2.8 3.5 5.8 3.5 9s-1 6.2-3.5 9c-2.5-2.8-3.5-5.8-3.5-9s1-6.2 3.5-9z\"/>", "link": "<path d=\"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1\"/><path d=\"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1\"/>"};
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.link) + '</svg>';
  }

  /* ----------------------------------------------------------- link catalog */
  function handle(v) { return String(v || '').trim().replace(/^@/, ''); }
  function phoneDigits(v) { var d = String(v || '').replace(/\D/g, ''); return d.charAt(0) === '0' ? '20' + d.slice(1) : d; }
  var TYPES = {
    whatsapp:  { n: 'WhatsApp',  g: 'linear-gradient(135deg,#13b45c,#00bfa6)', ph: '01xxxxxxxxx', b: function (v) { return 'https://wa.me/' + phoneDigits(v); } },
    instagram: { n: 'Instagram', g: 'linear-gradient(135deg,#ffb020,#ff3d8b 50%,#7b4dff)', ph: '@username', b: function (v) { return 'https://www.instagram.com/' + handle(v); } },
    tiktok:    { n: 'TikTok',    g: 'linear-gradient(135deg,#141628,#ff3d8b)', ph: '@username', b: function (v) { return 'https://www.tiktok.com/@' + handle(v); } },
    facebook:  { n: 'Facebook',  g: 'linear-gradient(135deg,#2f6bff,#7b4dff)', ph: 'username', b: function (v) { return 'https://www.facebook.com/' + handle(v); } },
    linkedin:  { n: 'LinkedIn',  g: 'linear-gradient(135deg,#2f6bff,#5aa9ff)', ph: 'username', b: function (v) { return 'https://www.linkedin.com/in/' + handle(v); } },
    github:    { n: 'GitHub',    g: 'linear-gradient(135deg,#141628,#454b75)', ph: 'username', b: function (v) { return 'https://github.com/' + handle(v); } },
    telegram:  { n: 'Telegram',  g: 'linear-gradient(135deg,#2aabee,#2f6bff)', ph: '@username', b: function (v) { return 'https://t.me/' + handle(v); } },
    x:         { n: 'X',         g: 'linear-gradient(135deg,#141628,#3a3f55)', ph: '@username', b: function (v) { return 'https://x.com/' + handle(v); } },
    youtube:   { n: 'YouTube',   g: 'linear-gradient(135deg,#ff3d3d,#ff3d8b)', ph: '@channel', b: function (v) { return 'https://www.youtube.com/@' + handle(v); } },
    snapchat:  { n: 'Snapchat',  g: 'linear-gradient(135deg,#ffd400,#ffb020)', ph: 'username', b: function (v) { return 'https://www.snapchat.com/add/' + handle(v); } },
    spotify:   { n: 'Spotify',   g: 'linear-gradient(135deg,#1fc46b,#00bfa6)', ph: 'https://open.spotify.com/…', b: null },
    website:   { n: 'Website',   g: 'linear-gradient(135deg,#7b4dff,#2f6bff)', ph: 'example.com', b: null },
    instapay:  { n: 'InstaPay',  g: 'linear-gradient(135deg,#5b2dbd,#a24bff)', ph: 'https://ipn.eg/S/…', b: null, pay: true },
    telda:     { n: 'telda',     g: 'linear-gradient(135deg,#141628,#2b2f45)', ph: 'https://ipn.eg/S/…', b: null, pay: true, ink: '#c8ff4d' },
    link:      { n: 'Link',      g: 'linear-gradient(135deg,#00bfa6,#2f6bff)', ph: 'https://…', b: null }
  };

  function safeUrl(u) {
    u = String(u || '').trim();
    return /^(https?:\/\/|mailto:|tel:)/i.test(u) ? u : '#';
  }
  function hrefFor(type, v) {
    v = String(v || '').trim();
    if (!v) return '#';
    if (/^https?:\/\//i.test(v)) return safeUrl(v);
    var t = TYPES[type] || TYPES.link;
    if (/^[\w-]+(\.[\w-]+)+(\/|$)/.test(v) && type !== 'whatsapp') return safeUrl('https://' + v);
    return t.b ? safeUrl(t.b(v)) : safeUrl('https://' + v);
  }
  function shortOf(type, v) {
    v = String(v || '').trim();
    if (!/^https?:\/\//i.test(v) && !/\//.test(v)) return type === 'whatsapp' ? v : '@' + handle(v);
    var s = v.replace(/^https?:\/\//i, '').replace(/^www\./, '').replace(/\?.*$/, '').replace(/\/$/, '');
    var parts = s.split('/');
    return parts.length > 1 ? parts[parts.length - 1] : s;
  }

  /* --------------------------------------------------------------- render */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function rich(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function initials(n) { return esc(String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase()); }

  var EQ = '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>';
  function tile(l, i, wide) {
    var t = TYPES[l.type] || TYPES.link;
    var name = l.label || t.n, sub = l.sub || shortOf(l.type, l.value);
    var end = (l.type === 'spotify' ? EQ : '') + (l.type !== 'spotify' || wide ? '<span class="ar">↗</span>' : '');
    return '<a class="l panel rv' + (wide ? ' wide' : '') + (t.pay ? ' pay' : '') + '" style="--i:' + i + ';--c:' + t.g + (t.ink ? ';--ink2:' + t.ink : '') + '" href="' + esc(hrefFor(l.type, l.value)) + '" target="_blank" rel="noopener">' +
      '<span class="ico"' + (t.ink ? ' style="color:' + t.ink + '"' : '') + '>' + icon(l.type) + '</span><span class="tx"><b>' + esc(name) + '</b><span>' + esc(sub) + '</span></span>' + end + '</a>';
  }
  function grid(list, start) {
    var html = '', n = list.length;
    list.forEach(function (l, k) { html += tile(l, start + k, n % 2 === 1 && k === n - 1); });
    return '<div class="grid">' + html + '</div>';
  }

  function render(P, el) {
    P = P || {};
    var i = 0, h = '';
    var av = P.avatar ? '<img src="' + esc(P.avatar) + '" alt="' + esc(P.name) + '">' : '<span class="ini">' + initials(P.name) + '</span>';
    h += '<section class="panel me rv" style="--i:' + (i++) + '"><div class="av">' + av + '</div><h1>' + esc(P.name || 'Your Name') + '</h1>' +
      (P.status ? '<div class="st">' + esc(P.status) + '</div>' : '<div></div>') +
      (P.bio ? '<p>' + rich(P.bio) + '</p>' : '') +
      (P.terminal ? '<div class="term"><span class="p">$</span><span>' + esc(P.terminal) + '</span><span class="cur"></span></div>' : '') + '</section>';

    var links = (P.links || []).filter(function (l) { return l && l.value; });
    var pr = P.primary && P.primary.value ? P.primary : null;
    if (pr || links.length) {
      h += '<div class="lbl rv" style="--i:' + (i++) + '"><span><b>//</b> connect</span></div>';
      if (pr) {
        var pt = TYPES[pr.type] || TYPES.whatsapp;
        h += '<a class="l rv wa" style="--i:' + (i++) + ';background-image:' + pt.g.replace(')', ',#2fb6ff)') + '" href="' + esc(hrefFor(pr.type, pr.value)) + '" target="_blank" rel="noopener"><span class="ico">' + icon(pr.type) +
          '</span><span class="tx"><b>' + esc(pr.label || pt.n) + '</b><span>' + esc(pr.sub || 'Message me directly') + '</span></span><span class="ar">→</span></a>';
      }
      if (links.length) { h += grid(links, i); i += links.length; }
    }
    var pay = (P.pay || []).filter(function (l) { return l && l.value; });
    if (pay.length) {
      h += '<div class="lbl rv" style="--i:' + (i++) + '"><span><b>//</b> pay</span></div>' + grid(pay, i); i += pay.length;
    }
    var c = P.contact || {};
    if (c.phone || c.email) {
      h += '<div class="lbl rv" style="--i:' + (i++) + '"><span><b>//</b> contact</span></div><div class="panel contact rv" style="--i:' + (i++) + '">' +
        (c.phone ? '<button class="cp" data-copy="' + esc(c.phone) + '">' + icon('phone') + '<span class="v">' + esc(c.phone) + '</span><span class="cl">copy</span></button>' : '') +
        (c.email ? '<button class="cp" data-copy="' + esc(c.email) + '">' + icon('mail') + '<span class="v">' + esc(c.email) + '</span><span class="cl">copy</span></button>' : '') + '</div>';
    }
    h += '<div class="foot rv" style="--i:' + (i++) + '"><span class="m">' + esc(P.brand || CFG.brand || 'NFC') + '</span><span>' + esc(P.tagline || 'tap · connect · build') + '</span></div>';
    el.innerHTML = h;
    applySkin(P.skin);
  }

  var SKINS = {
    aurora: ['#2f6bff', '#7b4dff', '#ff3d8b'],
    ocean:  ['#0077ff', '#00a3c4', '#00bfa6'],
    sunset: ['#ff6a3d', '#ff3d8b', '#b03dff'],
    lime:   ['#00a86b', '#1fc46b', '#b8d400'],
    mono:   ['#141628', '#454b75', '#8a90a8']
  };
  function applySkin(name, root) {
    var s = SKINS[name] || SKINS.aurora, r = (root || document.documentElement).style;
    r.setProperty('--grad', 'linear-gradient(110deg,' + s[0] + ',' + s[1] + ' 50%,' + s[2] + ')');
    r.setProperty('--violet', s[1]);
    r.setProperty('--blue', s[0]);
  }

  /* copy buttons (event delegation, works for re-rendered content) */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-copy]'); if (!btn) return;
    var t = btn.getAttribute('data-copy'), lbl = btn.querySelector('.cl');
    function done() { if (lbl) { lbl.textContent = 'copied'; btn.classList.add('ok'); setTimeout(function () { lbl.textContent = 'copy'; btn.classList.remove('ok'); }, 1500); } }
    function fb() { var ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (x) {} document.body.removeChild(ta); }
    try { navigator.clipboard.writeText(t).then(done, fb); } catch (x) { fb(); }
  });

  /* --------------------------------------------------------------- storage */
  function loadScript(src) {
    return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Could not load ' + src)); }; document.head.appendChild(s); });
  }
  var Store = {
    mode: 'local', error: null,
    init: function () {
      var self = this;
      if (!CFG.firebase || !CFG.firebase.apiKey) return Promise.resolve(self);
      var v = '10.12.2', base = 'https://www.gstatic.com/firebasejs/' + v + '/';
      return loadScript(base + 'firebase-app-compat.js')
        .then(function () { return Promise.all([loadScript(base + 'firebase-auth-compat.js'), loadScript(base + 'firebase-firestore-compat.js')]); })
        .then(function () {
          firebase.initializeApp(CFG.firebase);
          self.db = firebase.firestore(); self.auth = firebase.auth(); self.mode = 'cloud';
          return self;
        })
        .catch(function (e) { self.error = e; self.mode = 'local'; return self; });
    },
    key: function (slug) { return 'nfc-profile:' + slug; },
    get: function (slug) {
      if (this.mode === 'cloud') return this.db.collection('profiles').doc(slug).get().then(function (d) { return d.exists ? d.data() : null; });
      try { var raw = localStorage.getItem(this.key(slug)); return Promise.resolve(raw ? JSON.parse(raw) : null); } catch (e) { return Promise.resolve(null); }
    },
    save: function (slug, data) {
      if (this.mode === 'cloud') {
        var d = JSON.parse(JSON.stringify(data)); d.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        return this.db.collection('profiles').doc(slug).set(d);
      }
      try { localStorage.setItem(this.key(slug), JSON.stringify(data)); return Promise.resolve(); }
      catch (e) { return Promise.reject(new Error('Your browser blocked saving. Turn off private mode and try again.')); }
    },
    /* Exchange a secret edit code for the profile it unlocks (cloud mode). */
    claim: function (code) {
      var self = this;
      return self.auth.signInAnonymously()
        .then(function () { return self.db.collection('keys').doc(code).get(); })
        .then(function (d) {
          if (!d.exists || !d.data().slug) throw new Error('badkey');
          var slug = d.data().slug;
          return self.db.collection('sessions').doc(self.auth.currentUser.uid).set({ slug: slug, code: code }).then(function () { return slug; });
        });
    }
  };

  function slugFromUrl() {
    var q = new URLSearchParams(location.search).get('u');
    var hsh = location.hash.replace(/^#/, '');
    return (q || hsh || CFG.defaultSlug || 'demo').toLowerCase().replace(/[^a-z0-9_-]/g, '');
  }

  /* ------------------------------------------------------------ page effects */
  /* ---- background: Dart typing itself ---- */
function startCodeBg(){
  var c=document.getElementById('code'); if(!c||!c.getContext) return;
  var x=c.getContext('2d'), dpr=Math.min(devicePixelRatio||1,2), W,H, cols=[];
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PP=window.__P||{}, NM=String(PP.name||'Your Name').replace(/'/g,''), CL=(NM.split(/\s+/)[0]||'Me').replace(/[^A-Za-z]/g,'')||'Profile';
  var LK=(PP.links||[]).slice(0,4).map(function(l){return "  Link."+l.type+"(),";});
  var SRC=["import 'package:flutter/material.dart';","","class "+CL+" extends StatelessWidget {","  const "+CL+"({super.key});","","  @override","  Widget build(BuildContext context) {","    return Card(","      holder: '"+NM+"',","      chip: NfcChip.ntag215,","    );","  }","}","",
  "// tap · connect · build","final links = <Link>["].concat(LK,["];","",
  "Future<void> connect() async {","  final tag = await NfcManager.read();","  if (tag.isValid) {","    await launchUrl(profileUrl);","  }","}","",
  "class Architecture {","  final layers = ['ui', 'domain', 'data'];","  final state = Bloc<Event, State>();","  final perf = 120; // fps","}","",
  "void main() => runApp(const "+CL+"());",""]);
  var KW=/^(import|class|extends|const|final|return|async|await|if|void|super|true|false)$/;
  var C={kw:'#7b4dff',str:'#00a58f',ty:'#2f6bff',cm:'#9aa1b9',num:'#ff8a00',fn:'#ff3d8b',at:'#ff3d8b',p:'#4a5070'};
  function tok(s){
    var out=[],m,re=/(\/\/.*$)|('[^']*'?)|(@\w+)|(\b\d+\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z_\d'])/g;
    while((m=re.exec(s))){var t=m[0],k='p';
      if(m[1])k='cm';else if(m[2])k='str';else if(m[3])k='at';else if(m[4])k='num';
      else if(m[5]){ if(KW.test(t))k='kw'; else if(/^[A-Z]/.test(t))k='ty'; else if(s.charAt(re.lastIndex)==='(')k='fn'; }
      out.push([t,k]);}
    return out;
  }
  var LH=19, FS=12.5, CWD=360;
  function setup(){
    W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.max(1,Math.ceil(W/CWD)), gap=W/n; cols=[];
    for(var i=0;i<n;i++){
      var col={x:i*gap+14+(i%2)*10,src:Math.floor(Math.random()*SRC.length),lines:[],cur:'',ci:0,speed:22+Math.random()*16,acc:0,
        rows:Math.ceil(H/LH)+1,off:0};
      // prefill so the first frame already shows code
      var pre=Math.floor(col.rows*(.45+Math.random()*.4));
      for(var k=0;k<pre;k++){col.lines.push(SRC[col.src]);col.src=(col.src+1)%SRC.length;}
      cols.push(col);
    }
  }
  var cache={};
  function T(s){return cache[s]||(cache[s]=tok(s));}
  function line(s,px,py,partial){
    var t=T(s),cx=px; x.font='500 '+FS+'px "JetBrains Mono",ui-monospace,monospace';
    for(var i=0;i<t.length;i++){x.fillStyle=C[t[i][1]];x.fillText(t[i][0],cx,py);cx+=x.measureText(t[i][0]).width;}
    return cx;
  }
  var last=performance.now();
  function frame(now){
    var dt=Math.min(.05,(now-last)/1000); last=now;
    x.clearRect(0,0,W,H); x.textBaseline='middle';
    cols.forEach(function(col){
      if(!still){
        col.acc+=dt*col.speed;
        while(col.acc>=1){col.acc-=1; var target=SRC[col.src];
          if(col.ci<target.length){col.ci++;}
          else{col.lines.push(target);col.src=(col.src+1)%SRC.length;col.ci=0;col.acc-=3;}
        }
        col.cur=SRC[col.src].slice(0,col.ci);
        if(col.lines.length>=col.rows-1){col.off+=dt*LH*2.2; if(col.off>=LH){col.off-=LH;col.lines.shift();}}
      }
      var y=LH*.8-col.off;
      x.globalAlpha=W<560?.14:.22;
      for(var i=0;i<col.lines.length;i++){ if(col.lines[i]) line(col.lines[i],col.x,y); y+=LH; }
      x.globalAlpha=W<560?.28:.42;
      var end=line(col.cur,col.x,y);
      if(Math.floor(now/450)%2===0){x.fillStyle='#7b4dff';x.fillRect(end+1,y-7,7,14);}
      x.globalAlpha=1;
    });
    if(!still) requestAnimationFrame(frame);
  }
  setup(); addEventListener('resize',function(){setup(); if(still) frame(performance.now());});
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){cache={};});
  requestAnimationFrame(frame);
}
  /* ---- scroll: progress bar + reveal ---- */
function startReveal(){
  var bar=document.querySelector('.prog');
  function on(){var m=document.documentElement.scrollHeight-innerHeight; if(bar) bar.style.transform='scaleX('+(m>0?scrollY/m:0)+')';}
  addEventListener('scroll',on,{passive:true}); on();
  if(!('IntersectionObserver' in window)) return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
  document.querySelectorAll('.rv').forEach(function(el){ if(el.getBoundingClientRect().top>innerHeight-10){el.classList.add('later');io.observe(el);} });
  addEventListener('pointerdown',function(e){var r=document.createElement('span');r.className='ripple';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';
    r.style.borderColor=['#2f6bff','#7b4dff','#ff3d8b','#00bfa6','#ffb020'][Math.floor(Math.random()*5)];document.body.appendChild(r);setTimeout(function(){r.remove()},850);});
}

  /* ----------------------------------------------------------- public boot */
  function boot() {
    var t0 = performance.now(), el = document.getElementById('app');
    var slug = slugFromUrl();
    Store.init().then(function () { return Store.get(slug); }).catch(function () { return null; }).then(function (P) {
      P = P || DEFAULT;
      window.__P = P;
      var elapsed = (performance.now() - t0) / 1000;
      document.documentElement.style.setProperty('--base', Math.max(0.1, 2.15 - elapsed) + 's');
      if (P.name) document.title = P.name;
      render(P, el);
      startCodeBg(); startReveal();
    });
  }

  var DEFAULT = {"name": "Ahmed Abd El-Meneam", "status": "Open to new projects", "avatar": "data:image/jpeg;base64,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", "bio": "**Flutter & Dart Specialist** · Mid-Senior Mobile Engineer · Scalable Architecture · High-Performance Cross-Platform Solutions · **Lawyer**", "terminal": "flutter run --release ahmed", "primary": {"type": "whatsapp", "value": "01016753299", "label": "WhatsApp", "sub": "Message me directly · fastest reply"}, "links": [{"type": "linkedin", "value": "https://www.linkedin.com/in/ahmed-abd-el-meneam-980b51282/", "sub": "ahmed-abd-el-meneam"}, {"type": "github", "value": "AhmedAbdElmeneam"}, {"type": "instagram", "value": "3bmeneam_22"}, {"type": "tiktok", "value": "a7mz_22"}, {"type": "telegram", "value": "abmeneam_22"}, {"type": "facebook", "value": "https://www.facebook.com/ahmed.abd.el.meneam.552198", "sub": "ahmed.abd.el.meneam"}, {"type": "spotify", "value": "https://open.spotify.com/user/31vqk6shdr4gzcnu5hvy2uwbryy4", "sub": "What I listen to"}], "pay": [{"type": "instapay", "value": "https://ipn.eg/S/ahmedabdelmeneam/instapay/0ytf81", "sub": "ahmedabdelmeneam"}, {"type": "telda", "value": "https://ipn.eg/S/ahtelda09/instapay/3Betld", "sub": "ahtelda09"}], "contact": {"phone": "01016753299", "email": "ahmedabdelmeneam69@gmail.com"}, "skin": "aurora", "brand": "MENEAM", "tagline": "tap · connect · build"};

  window.NFC = { CFG: CFG, TYPES: TYPES, SKINS: SKINS, ICONS: ICONS, icon: icon, esc: esc, render: render, applySkin: applySkin, Store: Store, slugFromUrl: slugFromUrl, boot: boot, DEFAULT: DEFAULT, hrefFor: hrefFor };
})();
