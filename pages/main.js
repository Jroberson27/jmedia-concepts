
/* ═══════════════════════════════════════
   ALL JS IN ONE BLOCK — NO PATCHES
═══════════════════════════════════════ */

/* ── Setup ── */
document.body.classList.add('animated','mouse');
document.addEventListener('mousedown', function(){ document.body.classList.add('mouse'); });
document.addEventListener('keydown', function(e){ if(e.key==='Tab') document.body.classList.remove('mouse'); });
window.addEventListener('scroll', function(){ document.getElementById('nav').classList.toggle('sc', window.scrollY > 60); }, {passive:true});

/* ── Hero entrance ── */
(function(){
  var h1 = document.getElementById('hH1');
  var ci = document.getElementById('hCI');
  if(!h1) return;

  var lines = ['Your Content', "Shouldn\u2019t Feel Like"];
  var html = lines.map(function(line, li){
    return line.split(' ').map(function(word, wi){
      var delay = (0.15 + li*0.2 + wi*0.08).toFixed(2);
      return '<span class="hero-char" style="transition-delay:'+delay+'s">'+word+'</span>';
    }).join(' ');
  }).join('<br>');

  var ciText = 'Busy Work.';
  var ciHtml = ciText.split('').map(function(ch, i){
    var delay = (0.72 + i*0.04).toFixed(2);
    return '<span class="ci-char" style="transition-delay:'+delay+'s">'+(ch===' '?'&nbsp;':ch)+'</span>';
  }).join('');

  h1.innerHTML = html + '<span class="ci" id="hCI">'+ciHtml+'</span>';

  setTimeout(function(){ document.getElementById('hLogo').classList.add('in'); }, 150);
  setTimeout(function(){ document.querySelectorAll('.hero-char').forEach(function(el){ el.classList.add('in'); }); }, 300);
  setTimeout(function(){ document.querySelectorAll('.ci-char').forEach(function(el){ el.classList.add('in'); }); }, 680);
  setTimeout(function(){
    var ci2 = document.getElementById('hCI');
    if(ci2) ci2.classList.add('glowing');
  }, 1800);
  setTimeout(function(){
    document.getElementById('hSb').classList.add('in');
    document.getElementById('hBt').classList.add('in');
  }, 880);
})();

/* ── Hero scroll exit parallax ── */
(function(){
  var hero   = document.getElementById('hero');
  var hbg    = hero ? hero.querySelector('.hbg')    : null;
  var hgrain = hero ? hero.querySelector('.hgrain') : null;
  var hh1    = document.getElementById('hH1');
  var hsub   = document.getElementById('hSb');
  var hbtns  = document.getElementById('hBt');
  var hLogo  = document.getElementById('hLogo');
  var shint  = hero ? hero.querySelector('.shint')  : null;

  if(!hero) return;

  /* Kill CSS transitions on scroll-controlled elements
     so JS inline styles are not fought by CSS animations */
  var killT = 'transition:none!important;';
  setTimeout(function(){
    /* Wait for entrance to finish before taking scroll control */
    [hh1, hsub, hbtns, hLogo].forEach(function(el){
      if(el) el.style.cssText += killT;
    });
  }, 1200);

  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }

  var ticking = false;
  var ready    = false;

  /* Only run scroll animation after entrance settles */
  setTimeout(function(){ ready = true; update(); }, 1200);

  function update(){
    ticking = false;
    if(!ready) return;

    var scrollY = window.scrollY;
    var heroH   = hero.offsetHeight;
    var p = clamp(scrollY / heroH, 0, 1);

    if(hbg){
      hbg.style.transform = 'translateY(' + (scrollY * 0.38) + 'px) scale(' + (1 + p * 0.1) + ')';
    }
    if(hgrain){
      hgrain.style.transform = 'translateY(' + (scrollY * 0.2) + 'px)';
    }
    if(shint){
      shint.style.opacity = clamp(1 - p * 12, 0, 1) + '';
    }
    if(hLogo && ready){
      hLogo.style.opacity   = clamp(1 - p * 3,   0, 1) + '';
      hLogo.style.transform = 'translateY(-' + (scrollY * 0.1) + 'px)';
    }
    if(hh1 && ready){
      hh1.style.opacity   = clamp(1 - p * 2.4, 0, 1) + '';
      hh1.style.transform = 'translateY(-' + (scrollY * 0.28) + 'px) scale(' + (1 - p * 0.05) + ')';
      hh1.style.filter    = p > 0.08 ? 'blur(' + (p * 5).toFixed(1) + 'px)' : 'none';
    }
    if(hsub && ready){
      hsub.style.opacity   = clamp(1 - p * 3.8, 0, 1) + '';
      hsub.style.transform = 'translateY(-' + (scrollY * 0.16) + 'px)';
    }
    if(hbtns && ready){
      hbtns.style.opacity   = clamp(1 - p * 5.5, 0, 1) + '';
      hbtns.style.transform = 'translateY(-' + (scrollY * 0.12) + 'px)';
    }
  }

  window.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }, {passive:true});
})();

/* ── Scroll reveal — bulletproof triple-trigger ── */
(function(){
  var els = Array.from(document.querySelectorAll('.ax'));

  function fire(el){
    if(!el.classList.contains('fired')){
      el.classList.add('fired');
    }
  }

  function checkAll(){
    var vh = window.innerHeight;
    els.forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.top < vh * 0.94 && r.bottom > 0) fire(el);
    });
  }

  /* Trigger 1: immediate above-fold check */
  checkAll();

  /* Trigger 2: scroll listener */
  window.addEventListener('scroll', checkAll, {passive:true});

  /* Trigger 3: IntersectionObserver */
  if('IntersectionObserver' in window){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting) fire(e.target); });
    }, {threshold:0.04, rootMargin:'0px 0px 0px 0px'});
    els.forEach(function(el){ obs.observe(el); });
  }

  /* Trigger 4: nuclear — fire everything at 800ms */
  setTimeout(function(){
    els.forEach(function(el){ fire(el); });
  }, 800);

  /* Trigger 5: re-check after images/fonts load */
  window.addEventListener('load', checkAll);
})();

/* ── Section accent animations on scroll ── */
(function(){
  /* Portal bar chart bars: scale up sequentially */
  var bars = Array.from(document.querySelectorAll('.sb'));
  var barsDone = false;
  /* Start bars at scale 0 */
  bars.forEach(function(b){ b.style.transform = 'scaleY(0)'; b.style.transformOrigin = 'bottom'; b.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)'; });

  /* Retainer table rows: stagger fade-right */
  var retRows = Array.from(document.querySelectorAll('.ret-table tr'));
  var retDone = false;
  retRows.forEach(function(r){ r.style.opacity='0'; r.style.transform='translateX(-12px)'; r.style.transition='opacity .5s ease, transform .5s cubic-bezier(.16,1,.3,1)'; });

  /* Feature rows (pf): already ax animated — add live pulse on icon */
  var pfIcons = Array.from(document.querySelectorAll('.pfi'));

  function checkAccents(){
    /* Portal bars */
    if(!barsDone && bars.length){
      var first = bars[0].getBoundingClientRect();
      if(first.top < window.innerHeight * 0.9){
        barsDone = true;
        bars.forEach(function(b, i){
          setTimeout(function(){
            b.style.transform = 'scaleY(1)';
          }, i * 60);
        });
      }
    }

    /* Retainer table rows */
    if(!retDone && retRows.length){
      var firstRow = retRows[0].getBoundingClientRect();
      if(firstRow.top < window.innerHeight * 0.9){
        retDone = true;
        retRows.forEach(function(r, i){
          setTimeout(function(){
            r.style.opacity   = '1';
            r.style.transform = 'translateX(0)';
          }, i * 80);
        });
      }
    }
  }

  window.addEventListener('scroll', checkAccents, {passive:true});
  checkAccents();
})();

/* ══════════════════════════════════════════════════
   APPLE-STYLE CANVAS DEPTH FIELD — Sticky Section
   Three particle layers with scroll-driven parallax,
   bokeh depth of field, aurora sweep, and coral bloom.
══════════════════════════════════════════════════ */
(function(){
  var canvas  = document.getElementById('ss-canvas');
  var ssEl    = document.getElementById('ss');
  var words   = Array.from(document.querySelectorAll('.w'));
  var dots    = [document.getElementById('sd1'),document.getElementById('sd2'),document.getElementById('sd3')];
  var n       = words.length;
  var W, H;
  var progress = 0;  /* 0→1 as user scrolls through section */
  var raf;

  if(!canvas || !ssEl) return;
  var ctx = canvas.getContext('2d');

  /* ── Resize ── */
  function resize(){
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, {passive:true});

  /* ── Particle factory ── */
  function mkParticle(layer){
    /* layer: 0=far, 1=mid, 2=near(bokeh) */
    var configs = [
      {minR:0.6, maxR:2.2,  minA:0.04, maxA:0.18, parallax:0.04, coral:0.05},
      {minR:2,   maxR:6,    minA:0.05, maxA:0.22, parallax:0.14, coral:0.15},
      {minR:45,  maxR:100,  minA:0.02, maxA:0.06, parallax:0.32, coral:0.5 }
    ];
    var c = configs[layer];
    return {
      x:   Math.random() * 1.4 - 0.2,   /* 0-1 normalised, slight overflow */
      y:   Math.random() * 1.3 - 0.15,
      r:   c.minR + Math.random() * (c.maxR - c.minR),
      a:   c.minA + Math.random() * (c.maxA - c.minA),
      parallax: c.parallax,
      coralChance: c.coral,
      isCoral: Math.random() < c.coral,
      speed: 0.00006 + Math.random() * 0.00012,  /* slow drift */
      drift: (Math.random() - 0.5) * 0.00004,
      layer: layer,
      phase: Math.random() * Math.PI * 2
    };
  }

  /* ── Seed particles ── */
  var particles = [];
  var counts = [72, 28, 9];
  counts.forEach(function(count, layer){
    for(var i=0; i<count; i++) particles.push(mkParticle(layer));
  });

  /* ── Lerp util ── */
  function lerp(a,b,t){ return a+(b-a)*t; }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
  function easeInOut(t){ return t<0.5?2*t*t:(4-2*t)*t-1; }

  /* ── Draw frame ── */
  var lastT = 0;
  function draw(ts){
    raf = requestAnimationFrame(draw);
    var dt = Math.min(ts - lastT, 32); lastT = ts;

    ctx.clearRect(0, 0, W, H);

    /* Background base */
    ctx.fillStyle = '#030303';
    ctx.fillRect(0, 0, W, H);

    /* Aurora — horizontal light sweep that shifts with progress */
    var auroraY  = lerp(0.68, 0.42, easeInOut(progress));
    var auroraA  = lerp(0.05, 0.22, easeInOut(progress));
    var auroraW  = lerp(0.55, 0.75, progress);

    /* Primary aurora — warm coral */
    var ag1 = ctx.createRadialGradient(W*0.5, H*auroraY, 0, W*0.5, H*auroraY, W*auroraW);
    ag1.addColorStop(0,   'rgba(232,98,90,'+(auroraA)+')');
    ag1.addColorStop(0.4, 'rgba(180,60,40,'+(auroraA*0.4)+')');
    ag1.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = ag1;
    ctx.fillRect(0, 0, W, H);

    /* Secondary aurora — deep warm offset */
    var ag2 = ctx.createRadialGradient(W*0.3, H*(auroraY+0.1), 0, W*0.3, H*(auroraY+0.1), W*0.4);
    ag2.addColorStop(0,   'rgba(100,30,15,'+(auroraA*0.6)+')');
    ag2.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = ag2;
    ctx.fillRect(0, 0, W, H);

    /* Subtle cool counter-aurora at top */
    var ag3 = ctx.createRadialGradient(W*0.75, H*0.12, 0, W*0.75, H*0.12, W*0.35);
    ag3.addColorStop(0, 'rgba(40,20,15,'+(auroraA*0.3)+')');
    ag3.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ag3;
    ctx.fillRect(0, 0, W, H);

    /* ── Particles — far to near (painter's order) ── */
    particles.forEach(function(p){
      /* Drift */
      p.y -= p.speed * dt;
      p.x += p.drift * dt;
      /* Wrap */
      if(p.y < -0.18) p.y = 1.15;
      if(p.x < -0.22) p.x = 1.22;
      if(p.x >  1.22) p.x = -0.22;

      /* Parallax offset based on scroll progress */
      var py = p.y + (progress - 0.5) * p.parallax;

      /* Pixel coords */
      var px = p.x * W;
      var ppy = py * H;

      /* Pulse opacity for bokeh layer */
      var pulse = p.layer === 2
        ? Math.sin(ts * 0.0005 + p.phase) * 0.012 + 0
        : 0;

      /* Base alpha boosted when coral words lit (progress > 0.72) */
      var coralLit = clamp((progress - 0.72) / 0.18, 0, 1);
      var alpha = p.a + pulse + (p.isCoral && p.layer > 0 ? coralLit * 0.08 : 0);

      /* ── Draw ── */
      ctx.beginPath();
      if(p.layer === 2){
        /* Bokeh: large soft circle with radial gradient */
        var gr = ctx.createRadialGradient(px, ppy, 0, px, ppy, p.r);
        var col = p.isCoral
          ? 'rgba(232,98,90,'+alpha+')'
          : 'rgba(255,240,230,'+alpha+')';
        gr.addColorStop(0,   col);
        gr.addColorStop(0.5, p.isCoral
          ? 'rgba(200,70,50,'+(alpha*0.5)+')'
          : 'rgba(255,240,230,'+(alpha*0.4)+')');
        gr.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = gr;
        ctx.arc(px, ppy, p.r, 0, Math.PI*2);
        ctx.fill();
      } else {
        /* Star/dust particle */
        var col2 = p.isCoral
          ? 'rgba(232,98,90,'+alpha+')'
          : 'rgba(255,255,255,'+alpha+')';
        ctx.fillStyle = col2;
        ctx.arc(px, ppy, p.r, 0, Math.PI*2);
        ctx.fill();
        /* Tiny glow on brighter mid particles */
        if(p.layer === 1 && alpha > 0.14){
          ctx.beginPath();
          var gr2 = ctx.createRadialGradient(px, ppy, 0, px, ppy, p.r*4);
          gr2.addColorStop(0, p.isCoral
            ? 'rgba(232,98,90,'+(alpha*0.25)+')'
            : 'rgba(255,255,255,'+(alpha*0.15)+')');
          gr2.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gr2;
          ctx.arc(px, ppy, p.r*4, 0, Math.PI*2);
          ctx.fill();
        }
      }
    });

    /* Coral bloom when final line activates */
    var bloomA = clamp((progress - 0.75) / 0.15, 0, 1) * 0.14;
    if(bloomA > 0){
      var bl = ctx.createRadialGradient(W*0.5, H*0.5, 0, W*0.5, H*0.5, W*0.45);
      bl.addColorStop(0, 'rgba(232,98,90,'+bloomA+')');
      bl.addColorStop(0.6, 'rgba(180,50,30,'+(bloomA*0.4)+')');
      bl.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bl;
      ctx.fillRect(0, 0, W, H);
    }

    /* Light horizontal scan line — sweeps down with progress */
    var scanY = H * easeInOut(progress);
    var scanG = ctx.createLinearGradient(0, scanY-60, 0, scanY+60);
    scanG.addColorStop(0,   'rgba(255,255,255,0)');
    scanG.addColorStop(0.5, 'rgba(255,255,255,'+(lerp(0.012, 0.028, progress))+')');
    scanG.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = scanG;
    ctx.fillRect(0, scanY-60, W, 120);
  }

  /* ── Scroll handler — update progress & words ── */
  window.addEventListener('scroll', function(){
    var rect  = ssEl.getBoundingClientRect();
    var range = ssEl.offsetHeight - window.innerHeight;
    progress  = clamp(-rect.top / range, 0, 1);

    /* Three-state word reveal:
       progress maps 0→0.85 across all n words
       Each word occupies a 1/n slice of that range.
       BEFORE its slice  → dim    (no class)
       DURING its slice  → .flash (coral)
       AFTER its slice   → .on    (white)
       The "beam width" controls how many words are coral at once (~1.2 words) */
    var beam = 1.2;                       /* width of coral beam in word-units */
    var mapped = (progress / 0.85) * n;  /* 0 → n */

    words.forEach(function(w, i){
      var passed  = mapped > i + 1;       /* word fully behind beam */
      var flashing = !passed && mapped > i - (beam - 1); /* word in beam */
      w.classList.toggle('on',    passed);
      w.classList.toggle('flash', !passed && flashing);
    });

    /* Dots */
    var lit = Math.min(n, Math.round(progress / 0.85 * n));
    dots.forEach(function(d,i){ d.classList.toggle('on', lit >= Math.round((i+1)/dots.length*n)); });
  }, {passive:true});

  /* Start */
  raf = requestAnimationFrame(draw);
})();

/* ── Stat + Portal number animations ── */
(function(){

  /* ── Generic stat boxes: integer count-up ── */
  var boxes = Array.from(document.querySelectorAll('.stbn[data-target]'));
  var boxDone = [];
  function countUpInt(el, target){
    var start = performance.now();
    var dur = 1400;
    (function step(now){
      var p = Math.min(1, (now-start)/dur);
      var ease = 1 - Math.pow(1-p, 3);
      el.textContent = Math.round(ease*target)+'+';
      if(p<1) requestAnimationFrame(step);
    })(start);
  }

  /* ── Portal dashboard stats: custom count-up ── */
  /* +34%, 2.1x, +$28 */
  var portalStats = [
    { sel: '.psm:nth-child(1) .psmv', from: 0,  to: 34,  fmt: function(v){ return '+' + Math.round(v) + '%'; } },
    { sel: '.psm:nth-child(2) .psmv', from: 0,  to: 2.1, fmt: function(v){ return v.toFixed(1) + 'x'; }, step: 0.01 },
    { sel: '.psm:nth-child(3) .psmv', from: 0,  to: 28,  fmt: function(v){ return '+$' + Math.round(v); } }
  ];
  var portalDone = false;
  var portalEl   = document.querySelector('.puisum');

  function countUpPortal(stat){
    var el = document.querySelector(stat.sel);
    if(!el) return;
    var start = performance.now();
    var dur = 1600;
    (function step(now){
      var p = Math.min(1, (now-start)/dur);
      var ease = 1 - Math.pow(1-p, 3);
      var val = stat.from + (stat.to - stat.from) * ease;
      el.textContent = stat.fmt(val);
      if(p<1) requestAnimationFrame(step);
    })(start);
  }

  /* ── Section scroll checks ── */
  function check(){
    /* Stat boxes */
    boxes.forEach(function(el, i){
      if(boxDone[i]) return;
      var r = el.getBoundingClientRect();
      if(r.top < window.innerHeight * 0.88){
        boxDone[i] = true;
        setTimeout(function(){ countUpInt(el, +el.getAttribute('data-target')); }, i * 100);
      }
    });

    /* Portal stats */
    if(!portalDone && portalEl){
      var r = portalEl.getBoundingClientRect();
      if(r.top < window.innerHeight * 0.88){
        portalDone = true;
        portalStats.forEach(function(stat, i){
          setTimeout(function(){ countUpPortal(stat); }, i * 200);
        });
      }
    }
  }

  window.addEventListener('scroll', check, {passive:true});
  check();
})();

/* ══════════════════════════════════════════
   ROI CALCULATOR
   Self-contained. No external dependencies.
   Sliders use CSS custom property --pct for
   the gradient fill on the track.
   All DOM IDs unique and verified below.
══════════════════════════════════════════ */
(function(){

  /* -- Helpers -- */
  function $id(id){ return document.getElementById(id); }
  function fmt(n){ return '$' + Math.round(n).toLocaleString(); }

  /* -- Update slider gradient -- */
  function updateGrad(sl){
    var pct = ((sl.value - sl.min) / (sl.max - sl.min) * 100).toFixed(1) + '%';
    sl.style.setProperty('--pct', pct);
  }

  /* -- Grade system -- */
  function grade(otaPct){
    if(otaPct<=20) return {g:'A+',t:'Exceptional', s:'Under 20% OTA \u2014 excellent direct booking health', c:'#34d399', bg:'rgba(52,211,153,.15)'};
    if(otaPct<=35) return {g:'A', t:'Strong',      s:'Low OTA dependency \u2014 strong margin position',    c:'#34d399', bg:'rgba(52,211,153,.12)'};
    if(otaPct<=50) return {g:'B', t:'Average',     s:'Moderate OTA use \u2014 room for improvement',       c:'#60a5fa', bg:'rgba(96,165,250,.15)'};
    if(otaPct<=65) return {g:'C', t:'At Risk',     s:otaPct+'% via OTA \u2014 significant margin exposure', c:'#fbbf24', bg:'rgba(251,191,36,.15)'};
    if(otaPct<=75) return {g:'D', t:'Exposed',     s:'High OTA dependency \u2014 margin heavily impacted',  c:'#f97316', bg:'rgba(249,115,22,.15)'};
    return              {g:'F', t:'Critical',    s:'OTA controls bookings \u2014 urgent action needed',  c:'#E8625A', bg:'rgba(232,98,90,.2)'};
  }

  /* -- Pop animation -- */
  function pop(el){
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }

  /* -- Set achievement -- */
  function ach(id, icon, label, unlocked){
    var el = $id(id);
    if(!el) return;
    if(unlocked){ el.classList.add('on'); el.querySelector('.ach-icon').textContent = icon; }
    else        { el.classList.remove('on'); el.querySelector('.ach-icon').textContent = '\uD83D\uDD12'; }
  }

  /* -- Main calc -- */
  function calc(){
    var rooms = +$id('sl-rooms').value;
    var adr   = +$id('sl-adr').value;
    var ota   = +$id('sl-ota').value / 100;
    var comm  = +$id('sl-comm').value / 100;
    var occ   = +$id('sl-occ').value / 100;

    /* Financials */
    var total   = rooms * adr * occ * 365;
    var otaRev  = total * ota;
    var dirRev  = total * (1 - ota);
    var otaComm = otaRev * comm;
    var recover = otaRev * 0.25 * comm;
    var adrLift = Math.round(adr * 0.08);
    var projDir = dirRev + otaRev * 0.25;
    var roi     = Math.round((recover + adr * 0.08 * rooms * occ * 365 * 0.5) / 60000);
    var barMax  = Math.max(otaRev, projDir, dirRev) * 1.05 || 1;

    function bw(v){ return Math.min(100, v/barMax*100).toFixed(1)+'%'; }

    /* Display labels */
    $id('dv-rooms').textContent = rooms;
    $id('dv-adr').textContent   = '$' + adr;
    $id('dv-ota').textContent   = Math.round(ota*100) + '%';
    $id('dv-comm').textContent  = Math.round(comm*100) + '%';
    $id('dv-occ').textContent   = Math.round(occ*100) + '%';

    /* Metric cards */
    var cv = $id('rv-comm'); pop(cv); cv.textContent = fmt(otaComm);
    var rr = $id('rv-rec');  pop(rr); rr.textContent = fmt(recover);
    $id('rv-adr').textContent = '$' + adrLift + '/night';
    $id('rv-roi').textContent = roi + 'x';

    /* Bar chart */
    $id('rl-dir').textContent = fmt(dirRev);   $id('rb-dir').style.width = bw(dirRev);
    $id('rl-ota').textContent = fmt(otaRev);   $id('rb-ota').style.width = bw(otaRev);
    $id('rl-prj').textContent = fmt(projDir);  $id('rb-prj').style.width = bw(projDir);
    $id('rl-com').textContent = fmt(otaComm);  $id('rb-com').style.width = bw(otaComm);

    /* Grade */
    var otaPct = Math.round(ota*100);
    var g = grade(otaPct);
    var badge = $id('roi-gbadge');
    badge.textContent = g.g; badge.style.color = g.c; badge.style.background = g.bg;
    $id('roi-gtitle').textContent = g.t; $id('roi-gtitle').style.color = g.c;
    $id('roi-gsub').textContent   = g.s;

    /* Achievements */
    ach('ach-100k', '\uD83D\uDCB0', '$100k+ Recovery',  recover >= 100000);
    ach('ach-5x',   '\uD83D\uDE80', '5x+ ROI',          roi >= 5);
    ach('ach-a',    '\u2B50',       'Grade A',           otaPct <= 35);
    ach('ach-dir',  '\uD83C\uDFAF', 'Direct Majority',   ota < 0.5);
  }

  /* -- Wire sliders -- */
  var sliderIds = ['sl-rooms','sl-adr','sl-ota','sl-comm','sl-occ'];
  sliderIds.forEach(function(id){
    var sl = $id(id);
    if(!sl){ console.warn('ROI slider not found:', id); return; }
    updateGrad(sl);
    sl.addEventListener('input',  function(){ updateGrad(this); calc(); });
    sl.addEventListener('change', function(){ updateGrad(this); calc(); }); /* mobile fallback */
  });

  /* Initial render */
  calc();

})(); /* end ROI IIFE */

/* ── FAQ accordion ── */
document.querySelectorAll('.fi').forEach(function(item){
  item.querySelector('.fibtn').addEventListener('click', function(){
    if(item.hasAttribute('data-open')){
      item.removeAttribute('data-open');
      item.querySelector('.fibtn').setAttribute('aria-expanded','false');
    } else {
      item.setAttribute('data-open','');
      item.querySelector('.fibtn').setAttribute('aria-expanded','true');
    }
  });
});
