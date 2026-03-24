<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JMEDIA Productions — Your Hospitality Content Partner</title>
<meta name="description" content="JMEDIA is an embedded content partner for hotels and resorts delivering ongoing cinematic video and photography to grow direct bookings.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet">
<style>
/* ── TOKENS ── */
:root{
  --bg:#fff;--bg-alt:#f5f5f7;--bg-deep:#080808;--bg-card:#fff;--bg-card2:#f5f5f7;
  --text:#1d1d1f;--text-2:#424245;--text-3:#6e6e73;
  --text-inv:#f5f5f7;--text-inv2:rgba(255,255,255,.72);
  --coral:#E8625A;--coral-dk:#c94e47;--coral-bg:rgba(232,98,90,.08);--coral-brd:rgba(232,98,90,.25);
  --line:rgba(0,0,0,.08);--line-inv:rgba(255,255,255,.10);
  --nav-bg:rgba(255,255,255,.88);
  --sh-sm:0 2px 16px rgba(0,0,0,.06);--sh-md:0 16px 56px rgba(0,0,0,.14);
  --Fd:'Bebas Neue',sans-serif;--Fs:'Cormorant Garamond',serif;--Fb:'DM Sans',sans-serif;
  --max:1200px;--pad:80px;--green:#34d399;
}
@media(prefers-color-scheme:dark){:root{
  --bg:#000;--bg-alt:#111;--bg-deep:#000;--bg-card:#1c1c1e;--bg-card2:#2c2c2e;
  --text:#f5f5f7;--text-2:#aeaeb2;--text-3:#6e6e73;
  --line:rgba(255,255,255,.10);--nav-bg:rgba(0,0,0,.88);
  --sh-sm:0 2px 16px rgba(0,0,0,.4);--sh-md:0 16px 56px rgba(0,0,0,.6);
}}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;}
body{background:var(--bg);color:var(--text);font-family:var(--Fb);font-weight:300;overflow-x:hidden;line-height:1.6;}
a{text-decoration:none;color:inherit;}ul,ol{list-style:none;}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important;}}
.skip{position:absolute;top:-100%;left:1rem;background:var(--coral);color:#fff;padding:12px 20px;font-weight:500;z-index:9999;border-radius:0 0 4px 4px;transition:top .2s;}.skip:focus{top:0;}
.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
:focus-visible{outline:2px solid var(--coral);outline-offset:3px;}body.mouse :focus-visible{outline:none;}

/* ── NAV ── */
#nav{position:fixed;top:0;left:0;right:0;z-index:500;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 48px;transition:background .4s,backdrop-filter .4s,border-bottom .4s;}
#nav.sc{background:var(--nav-bg);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--line);}
.nlogo-w{height:34px;width:auto;display:block;}
.nlogo-d{height:34px;width:auto;display:none;}
#nav.sc .nlogo-w{display:none;}#nav.sc .nlogo-d{display:block;}
@media(prefers-color-scheme:dark){#nav.sc .nlogo-w{display:block;}#nav.sc .nlogo-d{display:none;}}
.nlinks{display:flex;gap:32px;position:absolute;left:50%;transform:translateX(-50%);}
.nlinks a{font-size:12px;letter-spacing:.5px;color:rgba(255,255,255,.8);transition:color .2s;}.nlinks a:hover{color:#fff;}
#nav.sc .nlinks a{color:var(--text-3);}#nav.sc .nlinks a:hover{color:var(--text);}
.ncta{font-size:12px;font-weight:500;padding:9px 20px;background:var(--coral);color:#fff;border-radius:980px;transition:background .2s,transform .15s;}
.ncta:hover{background:var(--coral-dk);transform:translateY(-1px);}

/* ── HERO ── */
#hero{position:relative;height:100svh;min-height:700px;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;}
/* Scroll exit — driven by JS custom properties on #hero */
#hero{
  --sp: 0;  /* scroll progress 0→1 */
}
/* Background scale out */
.hbg{
  transform-origin:center center;
  will-change:transform;
}
/* Content container drifts up and fades */
.hcon{
  will-change:transform,opacity;
}
/* Each hero word gets individual letter-spacing expansion */
.hero-char{
  will-change:transform,opacity,letter-spacing;
}
/* Scroll hint fades fast */
.shint{will-change:opacity;}
.hbg{position:absolute;inset:0;z-index:0;background:#080808;overflow:hidden;}
.hbg::before{content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 80% 65% at 70% 30%,rgba(232,98,90,.2) 0%,transparent 60%),
  radial-gradient(ellipse 50% 50% at 20% 80%,rgba(120,40,20,.28) 0%,transparent 55%),
  radial-gradient(ellipse 40% 40% at 80% 75%,rgba(60,15,8,.18) 0%,transparent 50%);
  animation:orbA 14s ease-in-out infinite;}
.hbg::after{content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 55% 40% at 35% 45%,rgba(232,98,90,.09) 0%,transparent 50%),
  radial-gradient(ellipse 30% 55% at 72% 55%,rgba(140,45,25,.14) 0%,transparent 45%);
  animation:orbB 18s ease-in-out infinite;}
@keyframes orbA{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-30px,20px) scale(1.05);}}
@keyframes orbB{0%,100%{transform:translate(0,0);}50%{transform:translate(24px,-18px) scale(1.08);}}
.hgrain{position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.18;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='.07'/%3E%3C/svg%3E");
  background-size:180px;}
.hbar{position:absolute;left:0;right:0;height:9%;background:#080808;z-index:3;pointer-events:none;}
.hbar.t{top:0;}.hbar.b{bottom:0;}
.hcon{position:relative;z-index:4;padding:0 80px 100px;max-width:calc(var(--max) + 160px);}
.hero-logo{display:block;height:48px;width:auto;margin-bottom:44px;opacity:0;transform:translateY(-16px) scale(.94);transition:opacity .8s ease,transform .8s cubic-bezier(.16,1,.3,1);}
.hero-logo.in{opacity:1;transform:translateY(0) scale(1);}
.hh1{font-family:var(--Fd);font-size:clamp(64px,9vw,148px);line-height:.88;letter-spacing:1px;color:#fff;margin-bottom:32px;}
.hh1 .ci{font-family:var(--Fs);font-style:italic;color:var(--coral);font-size:.88em;display:block;}
.hero-char{display:inline-block;opacity:0;transform:translateY(60px) rotate(-3deg);filter:blur(8px);transition:opacity .5s,transform .5s cubic-bezier(.16,1,.3,1),filter .5s;}
.hero-char.in{opacity:1;transform:translateY(0) rotate(0);filter:blur(0);}
.ci-char{display:inline-block;opacity:0;transform:translateY(40px) scale(.8);transition:opacity .4s,transform .4s cubic-bezier(.16,1,.3,1);}
.ci-char.in{opacity:1;transform:translateY(0) scale(1);}
@keyframes coralPulse{0%,100%{text-shadow:0 0 20px rgba(232,98,90,0);}50%{text-shadow:0 0 40px rgba(232,98,90,.5),0 0 80px rgba(232,98,90,.2);}}
.ci.glowing{animation:coralPulse 3s ease-in-out infinite 1s;}
.hsub{font-size:17px;line-height:1.75;color:rgba(255,255,255,.65);max-width:520px;margin-bottom:48px;opacity:0;transform:translateY(20px);transition:opacity .9s ease .7s,transform .9s ease .7s;}
.hsub.in{opacity:1;transform:translateY(0);}
.hbtns{display:flex;gap:14px;flex-wrap:wrap;opacity:0;transform:translateY(16px);transition:opacity .9s ease .9s,transform .9s ease .9s;}
.hbtns.in{opacity:1;transform:translateY(0);}
.shint{position:absolute;bottom:100px;right:80px;z-index:4;display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0;animation:fadeInD 1s ease 1.8s both;}
@keyframes fadeInD{to{opacity:1;}}
.shint span{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.35);writing-mode:vertical-rl;}
.sline{width:1px;height:56px;background:linear-gradient(to bottom,var(--coral),transparent);animation:linePulse 2.4s ease-in-out infinite;}
@keyframes linePulse{0%,100%{opacity:.4;}50%{opacity:1;}}

/* ── BUTTONS ── */
.btn-pill{display:inline-flex;align-items:center;font-size:13px;font-weight:500;padding:14px 30px;border-radius:980px;background:var(--coral);color:#fff;transition:background .2s,transform .15s,box-shadow .2s;border:none;cursor:pointer;font-family:var(--Fb);}
.btn-pill:hover{background:var(--coral-dk);transform:translateY(-2px);box-shadow:0 8px 24px rgba(232,98,90,.35);}
.btn-ghost{display:inline-flex;align-items:center;font-size:13px;font-weight:500;padding:13px 30px;border-radius:980px;background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.35);transition:border-color .2s,transform .15s;cursor:pointer;font-family:var(--Fb);}
.btn-ghost:hover{border-color:rgba(255,255,255,.7);transform:translateY(-2px);}
.btn-ghost-dk{display:inline-flex;align-items:center;font-size:13px;font-weight:500;padding:13px 30px;border-radius:980px;background:transparent;color:var(--text);border:1.5px solid var(--line);transition:border-color .2s,transform .15s;cursor:pointer;font-family:var(--Fb);}
.btn-ghost-dk:hover{border-color:var(--text-3);transform:translateY(-2px);}
.btn-lnk{display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:500;color:var(--coral);transition:gap .2s;}
.btn-lnk:hover{gap:10px;}
.btn-lnk::after{content:'→';}

/* ── TICKER ── */
.ticker{height:48px;overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;align-items:center;background:var(--bg);}
.ttrack{display:flex;animation:tickR 28s linear infinite;white-space:nowrap;}
.ttrack:hover{animation-play-state:paused;}
.ti{display:inline-flex;align-items:center;gap:24px;padding:0 24px;font-size:10px;letter-spacing:3.5px;text-transform:uppercase;color:var(--text-3);}
.ts{color:var(--coral);font-size:7px;}
@keyframes tickR{from{transform:translateX(0);}to{transform:translateX(-50%);}}

/* ── PARTNERS ── */
#partners{padding:80px var(--pad);border-bottom:1px solid var(--line);}
.inner{max-width:var(--max);margin:0 auto;}
.partners-lbl{font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:var(--text-3);text-align:center;margin-bottom:52px;}
.partners-row{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--line);border-radius:20px;overflow:hidden;background:var(--bg-card);box-shadow:var(--sh-sm);}
.plog{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px 24px;border-right:1px solid var(--line);transition:background .25s,transform .4s cubic-bezier(.16,1,.3,1);}
.plog:last-child{border-right:none;}
.plog:hover{background:var(--bg-alt);transform:translateY(-3px);}
.plog-mark{font-family:var(--Fd);font-size:22px;letter-spacing:3px;color:var(--text);opacity:.5;transition:opacity .25s;}
.plog-sub{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text-3);margin-top:5px;opacity:.4;transition:opacity .25s;}
.plog:hover .plog-mark,.plog:hover .plog-sub{opacity:1;}
.plog .accent{color:var(--coral);}
@keyframes fl1{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
@keyframes fl2{0%,100%{transform:translateY(-4px);}50%{transform:translateY(5px);}}
.plog:nth-child(odd){animation:fl1 6s ease-in-out infinite;}
.plog:nth-child(even){animation:fl2 7s ease-in-out infinite .5s;}

/* ── STICKY STATEMENT ── */
#ss{position:relative;height:480vh;}
.ssi{position:sticky;top:0;height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#030303;}
/* Canvas fills the background */
#ss-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;}
/* Vignette overlay */
.ss-vignette{position:absolute;inset:0;z-index:1;pointer-events:none;
  background:radial-gradient(ellipse 85% 80% at 50% 50%,transparent 40%,rgba(0,0,0,.7) 100%);}
.sstxt{position:relative;z-index:2;text-align:center;max-width:1100px;padding:0 48px;}
.ss-line{display:block;margin-bottom:4px;}
.w{
  display:inline-block;
  color:rgba(255,255,255,.07);
  transition:color .45s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1),text-shadow .45s;
  transform:translateY(8px);
  font-family:var(--Fd);font-size:clamp(64px,9vw,130px);line-height:.96;letter-spacing:1px;
  will-change:color,transform;
}
.w em{font-family:var(--Fs);font-style:italic;font-size:.9em;}
/* FLASH: word currently under the scroll beam — hits coral first */
.w.flash{
  color:var(--coral);
  transform:translateY(0);
  text-shadow:0 0 48px rgba(232,98,90,.7),0 0 100px rgba(232,98,90,.25);
}
/* ON: word has passed the beam — settles to white */
.w.on{
  color:#fff;
  transform:translateY(0);
  text-shadow:none;
}
/* Coral words (last line) — flash is deeper coral, settled is coral */
.w.cr{color:rgba(232,98,90,.09);}
.w.cr.flash{
  color:var(--coral);
  transform:translateY(0);
  text-shadow:0 0 60px rgba(232,98,90,.9),0 0 120px rgba(232,98,90,.4);
}
.w.cr.on{
  color:var(--coral);
  transform:translateY(0);
  text-shadow:0 0 30px rgba(232,98,90,.35);
}
.ssdots{position:absolute;right:44px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:10px;z-index:3;}
.sdot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.2);transition:background .3s,transform .3s,box-shadow .3s;}
.sdot.on{background:var(--coral);transform:scale(1.6);box-shadow:0 0 8px rgba(232,98,90,.6);}

/* ── SECTIONS ── */
.sec{padding:100px var(--pad);}
.sec-alt{background:var(--bg-alt);}
.sec-deep{background:var(--bg-deep);}
.eyebrow{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--coral);display:block;margin-bottom:12px;}
.hl{font-family:var(--Fd);font-size:clamp(36px,4.5vw,68px);letter-spacing:1px;line-height:.95;color:var(--text);}
.hl em{font-family:var(--Fs);font-style:italic;color:var(--coral);font-size:.92em;}
.sec-deep .hl{color:var(--text-inv);}
.body-lg{font-size:16px;line-height:1.8;color:var(--text-2);}
.body-lg strong{color:var(--text);font-weight:400;}
.sec-deep .body-lg{color:var(--text-inv2);}
.sec-deep .body-lg strong{color:var(--text-inv);}

/* ── SCROLL ANIMATIONS ── */
body.animated .ax{opacity:0;animation-fill-mode:both;animation-play-state:paused;}
body.animated .ax.fired{animation-play-state:running;}
@keyframes axUp{from{opacity:0;transform:translateY(36px);}to{opacity:1;transform:translateY(0);}}
@keyframes axLeft{from{opacity:0;transform:translateX(-36px);}to{opacity:1;transform:translateX(0);}}
@keyframes axRight{from{opacity:0;transform:translateX(36px);}to{opacity:1;transform:translateX(0);}}
@keyframes axScale{from{opacity:0;transform:scale(.88);}to{opacity:1;transform:scale(1);}}
@keyframes axBlur{from{opacity:0;filter:blur(12px);transform:translateY(18px);}to{opacity:1;filter:blur(0);transform:translateY(0);}}
@keyframes axFlip{from{opacity:0;transform:perspective(600px) rotateX(35deg);}to{opacity:1;transform:perspective(600px) rotateX(0);}}
@keyframes axSpin{from{opacity:0;transform:rotate(-6deg) translateY(24px);}to{opacity:1;transform:rotate(0) translateY(0);}}
@keyframes axSpring{0%{opacity:0;transform:scale(0) rotate(-8deg);}60%{transform:scale(1.1) rotate(2deg);}80%{transform:scale(.97);}100%{opacity:1;transform:scale(1) rotate(0);}}
body.animated .ax-up    {animation:axUp     .8s cubic-bezier(.16,1,.3,1) both paused;}
body.animated .ax-left  {animation:axLeft   .85s cubic-bezier(.16,1,.3,1) both paused;}
body.animated .ax-right {animation:axRight  .85s cubic-bezier(.16,1,.3,1) both paused;}
body.animated .ax-scale {animation:axScale  .9s cubic-bezier(.16,1,.3,1) both paused;}
body.animated .ax-blur  {animation:axBlur   1s cubic-bezier(.16,1,.3,1) both paused;}
body.animated .ax-flip  {animation:axFlip   .9s cubic-bezier(.16,1,.3,1) both paused;}
body.animated .ax-spin  {animation:axSpin   .85s cubic-bezier(.16,1,.3,1) both paused;}
body.animated .ax-spring{animation:axSpring .9s cubic-bezier(.16,1,.3,1) both paused;}
body.animated .ax.fired{animation-play-state:running!important;}
.d1{animation-delay:.06s!important;}.d2{animation-delay:.12s!important;}
.d3{animation-delay:.18s!important;}.d4{animation-delay:.24s!important;}
.d5{animation-delay:.32s!important;}.d6{animation-delay:.40s!important;}

/* ── VALUE ── */
.vi{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;margin-bottom:72px;}
.vgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.vc{background:var(--bg-card);border:1px solid var(--line);border-radius:20px;padding:40px 32px;box-shadow:var(--sh-sm);transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s;}
.vc:hover{transform:translateY(-8px) scale(1.01);box-shadow:var(--sh-md);}
.vcn{font-family:var(--Fd);font-size:52px;color:var(--coral);opacity:.15;line-height:1;margin-bottom:20px;transition:opacity .3s;}
.vc:hover .vcn{opacity:.45;}
.vct{font-family:var(--Fd);font-size:24px;letter-spacing:.5px;margin-bottom:12px;color:var(--text);}
.vcb{font-size:14px;line-height:1.75;color:var(--text-3);}

/* ── HOW IT WORKS ── */
.hwgrid{display:grid;grid-template-columns:1fr 2fr;gap:80px;align-items:start;margin-top:64px;}
.hwl-p{font-size:16px;line-height:1.8;color:var(--text-2);margin-top:24px;}
.hwl-p strong{color:var(--text);font-weight:400;}
.hwsteps{border-top:1px solid var(--line);}
.hws{display:grid;grid-template-columns:64px 1fr;gap:32px;padding:40px 0;border-bottom:1px solid var(--line);align-items:start;transition:background .2s;}
.hws:hover{background:rgba(232,98,90,.02);}
.hwsn{font-family:var(--Fd);font-size:44px;color:var(--coral);opacity:.3;line-height:1;transition:opacity .3s;}
.hws:hover .hwsn{opacity:.7;}
.hwst{font-family:var(--Fd);font-size:26px;letter-spacing:.5px;margin-bottom:10px;color:var(--text);}
.hwsb{font-size:14px;line-height:1.75;color:var(--text-3);}
.hwsb strong{color:var(--text);font-weight:400;}

/* ── RETAINER ── */
.retcard{background:var(--bg-card);border:1px solid var(--line);border-radius:24px;padding:72px;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:start;box-shadow:var(--sh-sm);position:relative;overflow:hidden;}
.retcard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,var(--coral),transparent 65%);}
@keyframes scanLine{0%{transform:translateX(-100%);}100%{transform:translateX(200%);}}
.retcard::after{content:'';position:absolute;top:0;left:0;width:50%;height:3px;background:linear-gradient(to right,transparent,rgba(232,98,90,.8),transparent);animation:scanLine 4s ease-in-out infinite 1s;}
.rettag{display:inline-block;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--coral);background:var(--coral-bg);padding:6px 14px;border-radius:980px;border:1px solid var(--coral-brd);margin-bottom:20px;}
.reth{font-family:var(--Fd);font-size:clamp(32px,3.5vw,52px);letter-spacing:1px;line-height:.95;margin-bottom:20px;color:var(--text);}
.reth em{font-family:var(--Fs);font-style:italic;color:var(--coral);}
.rets{font-size:15px;line-height:1.8;color:var(--text-2);}
.rets strong{color:var(--text);font-weight:400;}
.retil{font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--text-3);margin-bottom:16px;}
.ret-table{width:100%;border-collapse:collapse;margin-bottom:28px;}
.ret-table tr{border-bottom:1px solid var(--line);transition:background .2s;}
.ret-table tr:hover{background:var(--coral-bg);}
.ret-table tr:last-child{border-bottom:none;}
.ret-table td{padding:14px 16px;font-size:13px;}
.ret-table td:first-child{font-weight:500;color:var(--text);width:48%;background:var(--bg-alt);}
.ret-table td:last-child{color:var(--text-2);}
.ret-table tr:first-child td:first-child{border-radius:10px 0 0 0;}
.ret-table tr:first-child td:last-child{border-radius:0 10px 0 0;}
.ret-table tr:last-child td:first-child{border-radius:0 0 0 10px;}
.ret-table tr:last-child td:last-child{border-radius:0 0 10px 0;}
.retcta{display:flex;gap:12px;flex-wrap:wrap;}

/* ── PORTAL ── */
.pwrap{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;}
.pfeats{display:flex;flex-direction:column;gap:8px;margin-top:32px;}
.pf{display:flex;align-items:flex-start;gap:16px;padding:16px 20px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid var(--line-inv);transition:background .25s,transform .3s;}
.pf:hover{background:rgba(255,255,255,.08);transform:translateX(5px);}
.pfi{font-size:20px;flex-shrink:0;line-height:1;margin-top:2px;}
.pft{font-size:14px;font-weight:500;color:#fff;margin-bottom:3px;}
.pfd{font-size:13px;color:rgba(255,255,255,.6);line-height:1.6;}
.pmsbadge{display:inline-flex;align-items:flex-start;gap:12px;margin-top:24px;padding:14px 20px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);}
@keyframes breathe{0%,100%{transform:scale(1);}50%{transform:scale(1.15);}}
.pmsdot{width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:4px;animation:breathe 2.4s ease-in-out infinite;}
.pmstxt{font-size:13px;color:rgba(255,255,255,.65);line-height:1.6;}
.pmstxt strong{color:#fff;font-weight:500;}
.pui{background:#1c1c1e;border:1px solid rgba(255,255,255,.12);border-radius:16px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.6);}
.puich{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:#141414;border-bottom:1px solid rgba(255,255,255,.08);}
.puidots{display:flex;gap:6px;}
.puid{width:10px;height:10px;border-radius:50%;}
.puid:nth-child(1){background:#ff5f57;}.puid:nth-child(2){background:#febc2e;}.puid:nth-child(3){background:#28c840;}
.puit{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.3);}
.puil{display:flex;align-items:center;gap:6px;font-size:10px;color:var(--green);font-weight:500;}
.puil-d{width:6px;height:6px;border-radius:50%;background:var(--green);animation:breathe 2s ease-in-out infinite;}
.puisum{display:grid;grid-template-columns:repeat(3,1fr);}
.psm{padding:20px;border-right:1px solid rgba(255,255,255,.06);}
.psm:last-child{border-right:none;}
.psml{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:6px;}
.psmv{font-family:var(--Fd);font-size:32px;color:var(--coral);letter-spacing:-1px;line-height:1;}
.psmd{font-size:10px;color:var(--green);margin-top:4px;}
.puitabs{display:flex;border-bottom:1px solid rgba(255,255,255,.06);}
.puitab{font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:12px 20px;color:rgba(255,255,255,.35);border-bottom:2px solid transparent;cursor:pointer;}
.puitab.on{color:var(--coral);border-bottom-color:var(--coral);}
.pvrow{display:grid;grid-template-columns:44px 1fr 80px 80px;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,.05);align-items:center;transition:background .2s;}
.pvrow:last-child{border-bottom:none;}.pvrow:hover{background:rgba(255,255,255,.04);}
.pvth{width:40px;height:28px;border-radius:4px;background:rgba(232,98,90,.12);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--coral);border:1px solid rgba(232,98,90,.2);}
.pvinfo{padding:0 14px;}
.pvn{font-size:12px;color:#fff;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pvd{font-size:10px;color:rgba(255,255,255,.3);}
.pvc{text-align:right;}
.pvnum{font-size:13px;font-weight:500;color:#fff;}
.pvtype{font-size:9px;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:2px;}
.pvc.g .pvnum{color:var(--green);}
.puispk{padding:16px 20px 20px;border-top:1px solid rgba(255,255,255,.06);}
.spkh{display:flex;justify-content:space-between;margin-bottom:10px;}
.spkl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.3);}
.spkbars{display:flex;align-items:flex-end;gap:3px;height:36px;}
.sb{flex:1;border-radius:2px 2px 0 0;background:var(--coral);}
.sb.lo{opacity:.2;}.sb.md{opacity:.5;}.sb.hi{opacity:1;}

/* ── STATS ── */
.stintro{max-width:620px;margin-bottom:80px;}
.stintro p{font-family:var(--Fs);font-size:clamp(20px,2.5vw,30px);font-weight:300;line-height:1.6;color:var(--text-2);font-style:italic;}
.stintro p strong{color:var(--text);font-style:normal;font-weight:400;}
.strow{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;}
.stbox{background:var(--bg-card);border:1px solid var(--line);padding:44px 36px;transition:transform .3s,background .2s;}
.stbox:hover{transform:scale(1.03) translateY(-3px);}
.stbn{font-family:var(--Fd);font-size:80px;line-height:1;color:var(--coral);letter-spacing:-2px;margin-bottom:8px;}
.stbl{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--text-3);}

/* ════════════════════════════════════════
   ROI CALCULATOR
════════════════════════════════════════ */
.roi-sec{background:var(--bg-deep);padding:100px var(--pad);position:relative;overflow:hidden;}
.roi-sec::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 45% at 75% 20%,rgba(232,98,90,.08),transparent 55%);pointer-events:none;}
.roi-head{text-align:center;max-width:680px;margin:0 auto 64px;}
.roi-head .hl{color:#fff;}
.roi-head p{font-size:15px;color:rgba(255,255,255,.5);margin-top:16px;line-height:1.7;}
.roi-layout{display:grid;grid-template-columns:1fr 1.2fr;gap:40px;align-items:start;}

/* Input panel */
.roi-panel{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:40px;}
.roi-panel-hd{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:32px;}
.roi-field{margin-bottom:28px;}
.roi-field:last-child{margin-bottom:0;}
.roi-frow{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.roi-fname{font-size:13px;color:rgba(255,255,255,.65);}
.roi-fval{font-family:var(--Fd);font-size:24px;letter-spacing:1px;color:var(--coral);min-width:80px;text-align:right;}

/* ── THE SLIDER ──
   Key decisions:
   - No fill div. Background gradient on the slider itself, updated by JS.
   - height:20px gives a large enough hit area without looking thick.
   - Transparent background so only the track pseudo-element shows.
   - -webkit-slider-runnable-track handles the fill gradient.
   - Both ::-webkit and ::-moz covered.
*/
.roi-sl{
  -webkit-appearance:none;
  appearance:none;
  width:100%;
  height:20px;
  background:transparent;
  cursor:pointer;
  outline:none;
  display:block;
}
/* WebKit track */
.roi-sl::-webkit-slider-runnable-track{
  height:5px;
  border-radius:5px;
  background:linear-gradient(
    to right,
    var(--coral) 0%,
    var(--coral) var(--pct,20%),
    rgba(255,255,255,.14) var(--pct,20%),
    rgba(255,255,255,.14) 100%
  );
}
/* WebKit thumb */
.roi-sl::-webkit-slider-thumb{
  -webkit-appearance:none;
  width:22px;
  height:22px;
  border-radius:50%;
  background:var(--coral);
  border:2px solid rgba(255,255,255,.3);
  box-shadow:0 2px 12px rgba(232,98,90,.5);
  margin-top:-8.5px;
  cursor:grab;
  transition:transform .15s,box-shadow .15s;
}
.roi-sl:active::-webkit-slider-thumb{
  cursor:grabbing;
  transform:scale(1.25);
  box-shadow:0 4px 20px rgba(232,98,90,.7);
}
/* Firefox track */
.roi-sl::-moz-range-track{
  height:5px;border-radius:5px;background:rgba(255,255,255,.14);
}
.roi-sl::-moz-range-progress{
  height:5px;border-radius:5px;background:var(--coral);
}
/* Firefox thumb */
.roi-sl::-moz-range-thumb{
  width:22px;height:22px;border-radius:50%;border:2px solid rgba(255,255,255,.3);
  background:var(--coral);box-shadow:0 2px 12px rgba(232,98,90,.5);cursor:grab;
}
.roi-rlabels{display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,.25);margin-top:4px;}

/* Results panel */
.roi-results{display:flex;flex-direction:column;gap:14px;}

/* Grade */
.roi-grade{display:flex;align-items:center;gap:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:20px 24px;}
.roi-gbadge{width:60px;height:60px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:var(--Fd);font-size:34px;flex-shrink:0;transition:background .4s,color .4s;}
.roi-ginfo{}
.roi-glabel{font-size:9px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:4px;}
.roi-gtitle{font-size:16px;font-weight:500;color:#fff;transition:color .4s;}
.roi-gsub{font-size:12px;color:rgba(255,255,255,.4);margin-top:2px;}

/* Achievements */
.roi-achs{display:flex;gap:8px;flex-wrap:wrap;}
.roi-ach{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:980px;font-size:11px;font-weight:500;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.3);transition:all .4s;}
.roi-ach.on{background:rgba(52,211,153,.1);border-color:rgba(52,211,153,.3);color:var(--green);}
.ach-icon{font-size:13px;}

/* Metric cards */
.roi-cards{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.roi-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:20px;}
.roi-card.hot{border-color:rgba(232,98,90,.3);background:rgba(232,98,90,.08);}
.roi-clbl{font-size:9px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:7px;}
.roi-cval{font-family:var(--Fd);font-size:clamp(26px,3vw,36px);letter-spacing:-1px;line-height:1;color:var(--coral);}
.roi-csub{font-size:11px;color:rgba(255,255,255,.35);margin-top:5px;}
@keyframes roiPop{0%{transform:scale(1);}40%{transform:scale(1.1);}100%{transform:scale(1);}}
.roi-cval.pop{animation:roiPop .25s ease;}

/* Bar chart */
.roi-chart{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:24px;}
.roi-chtitle{font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:18px;}
.roi-bars{display:flex;flex-direction:column;gap:12px;}
.roi-brow{display:flex;flex-direction:column;gap:5px;}
.roi-blbls{display:flex;justify-content:space-between;font-size:11px;}
.roi-blbls span:first-child{color:rgba(255,255,255,.4);}
.roi-blbls span:last-child{color:rgba(255,255,255,.75);font-weight:500;}
.roi-btrack{height:8px;background:rgba(255,255,255,.06);border-radius:8px;overflow:hidden;}
.roi-bfill{height:100%;border-radius:8px;transition:width .7s cubic-bezier(.16,1,.3,1);}
.roi-more{text-align:center;margin-top:4px;}
.roi-mlink{font-size:13px;font-weight:500;color:var(--coral);display:inline-flex;align-items:center;gap:6px;transition:gap .2s;}
.roi-mlink:hover{gap:10px;}
.roi-mlink::after{content:'→';}

/* ── FAQ ── */
.faqwrap{display:grid;grid-template-columns:1fr 1fr;gap:80px;}
.faqled{font-size:16px;line-height:1.8;color:var(--text-2);margin-top:20px;}
.flist{padding-top:4px;}
.fi{border-top:1px solid var(--line);}
.fi:last-child{border-bottom:1px solid var(--line);}
.fibtn{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 0;font-size:14px;font-weight:400;color:var(--text);background:none;border:none;cursor:pointer;text-align:left;font-family:var(--Fb);transition:color .2s;}
.fibtn:hover,.fi[data-open] .fibtn{color:var(--coral);}
.fitog{width:28px;height:28px;border-radius:50%;border:1.5px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;color:var(--text-3);transition:background .3s,transform .4s,border-color .3s,box-shadow .3s;}
.fi[data-open] .fitog{background:var(--coral);border-color:var(--coral);color:#fff;transform:rotate(45deg);box-shadow:0 4px 16px rgba(232,98,90,.35);}
.fans{font-size:14px;line-height:1.8;color:var(--text-3);max-height:0;overflow:hidden;transition:max-height .45s cubic-bezier(.16,1,.3,1),padding .3s;}
.fi[data-open] .fans{max-height:220px;padding-bottom:20px;}

/* ── CTA ── */
.ctasec{padding:160px var(--pad);text-align:center;background:var(--bg-alt);position:relative;overflow:hidden;}
.ctasec::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 100%,rgba(232,98,90,.08),transparent);pointer-events:none;}
.ctaey{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--coral);display:block;margin-bottom:16px;}
.ctah{font-family:var(--Fd);font-size:clamp(52px,7vw,108px);line-height:.92;letter-spacing:1px;color:var(--text);margin-bottom:24px;position:relative;z-index:1;}
.ctah em{font-family:var(--Fs);font-style:italic;color:var(--coral);}
.ctasub{font-size:17px;line-height:1.65;color:var(--text-2);max-width:500px;margin:0 auto;position:relative;z-index:1;}
.ctabtns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:36px;position:relative;z-index:1;}

/* ── FOOTER ── */
footer{background:var(--bg-deep);border-top:1px solid rgba(255,255,255,.08);padding:72px var(--pad) 48px;}
.fg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:56px;}
.flogo-img{height:32px;width:auto;display:block;margin-bottom:20px;transition:transform .3s;}
.flogo-img:hover{transform:scale(1.05);}
.ftagl{font-size:13px;line-height:1.75;color:rgba(255,255,255,.45);max-width:260px;margin-bottom:24px;}
.fsocs{display:flex;gap:8px;}
.fsoc{width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:rgba(255,255,255,.4);transition:border-color .2s,color .2s,transform .2s;}
.fsoc:hover{border-color:var(--coral);color:var(--coral);transform:translateY(-3px);}
.fch{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:18px;}
.fl li{margin-bottom:12px;}
.fl a{font-size:13px;color:rgba(255,255,255,.45);transition:color .2s;}
.fl a:hover{color:rgba(255,255,255,.9);}
.fbot{border-top:1px solid rgba(255,255,255,.08);padding-top:28px;display:flex;align-items:center;justify-content:space-between;font-size:12px;color:rgba(255,255,255,.3);flex-wrap:wrap;gap:12px;}

/* ── RESPONSIVE ── */
@media(max-width:960px){
  :root{--pad:24px;}
  #nav{padding:0 20px;}.nlinks{display:none;}
  .hcon{padding:0 24px 80px;}.hero-logo{height:38px;}.shint{display:none;}
  .vi,.vgrid,.hwgrid,.retcard,.pwrap,.strow,.faqwrap,.fg{grid-template-columns:1fr;}
  .partners-row{grid-template-columns:repeat(3,1fr);}
  .plog:nth-child(n+4){border-top:1px solid var(--line);}
  .plog:nth-child(3){border-right:none;}
  .retcard{padding:40px 28px;}
  .strow{grid-template-columns:1fr 1fr;}
  .puisum{grid-template-columns:1fr 1fr;}
  .pvrow{grid-template-columns:44px 1fr 72px;}
  .pvrow .pvc:last-child{display:none;}
  .w{font-size:clamp(44px,8vw,72px);}
  .roi-layout{grid-template-columns:1fr;}
  .roi-cards{grid-template-columns:1fr 1fr;}
}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to main content</a>

<!-- NAV -->
<nav id="nav" aria-label="Main navigation">
  <a href="/" aria-label="JMEDIA Productions home">
    <img src="jmedia-logo.png" alt="JMEDIA Productions" class="nlogo-w">
    <img src="jmedia-logo-light.png" alt="JMEDIA Productions" class="nlogo-d">
  </a>
  <div class="nlinks">
    <a href="services.html">Services</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
  </div>
  <a href="contact.html" class="ncta">Book a Free Audit</a>
</nav>

<main id="main">

<!-- HERO -->
<section id="hero" aria-label="Introduction">
  <div class="hbg" aria-hidden="true"></div>
  <div class="hgrain" aria-hidden="true"></div>
  <div class="hbar t" aria-hidden="true"></div>
  <div class="hbar b" aria-hidden="true"></div>
  <div class="hcon">
    <img src="jmedia-logo.png" alt="JMEDIA Productions" class="hero-logo" id="hLogo">
    <h1 class="hh1" id="hH1" aria-label="Your Content Shouldn't Feel Like Busy Work.">
      Your Content<br>Shouldn&rsquo;t Feel Like<span class="ci" id="hCI">Busy Work.</span>
    </h1>
    <p class="hsub" id="hSb">JMEDIA is an embedded content partner for hotels and resorts &mdash; delivering ongoing cinematic video and photography without big-budget overhead.</p>
    <div class="hbtns" id="hBt">
      <a href="contact.html" class="btn-pill">Book a Free Audit</a>
      <a href="services.html" class="btn-ghost">See How It Works</a>
    </div>
  </div>
  <div class="shint" aria-hidden="true"><div class="sline"></div><span>Scroll</span></div>
</section>

<!-- TICKER -->
<div class="ticker" aria-hidden="true">
  <div class="ttrack">
    <span class="ti">Ongoing Partnerships <span class="ts">&#10022;</span></span>
    <span class="ti">Agile Production <span class="ts">&#10022;</span></span>
    <span class="ti">Brand Films <span class="ts">&#10022;</span></span>
    <span class="ti">OTA Visuals <span class="ts">&#10022;</span></span>
    <span class="ti">Social Content <span class="ts">&#10022;</span></span>
    <span class="ti">Direct Booking Growth <span class="ts">&#10022;</span></span>
    <span class="ti">Hospitality Specialists <span class="ts">&#10022;</span></span>
    <span class="ti">Ongoing Partnerships <span class="ts">&#10022;</span></span>
    <span class="ti">Agile Production <span class="ts">&#10022;</span></span>
    <span class="ti">Brand Films <span class="ts">&#10022;</span></span>
    <span class="ti">OTA Visuals <span class="ts">&#10022;</span></span>
    <span class="ti">Social Content <span class="ts">&#10022;</span></span>
    <span class="ti">Direct Booking Growth <span class="ts">&#10022;</span></span>
    <span class="ti">Hospitality Specialists <span class="ts">&#10022;</span></span>
  </div>
</div>

<!-- PARTNERS -->
<section id="partners" aria-label="Brand partners">
  <div class="inner">
    <p class="partners-lbl ax ax-up">Trusted By</p>
    <ul class="partners-row" role="list">
      <li class="plog ax ax-up d1" title="Universal Orlando"><div class="plog-mark">UNIVERSAL</div><div class="plog-sub">Orlando</div></li>
      <li class="plog ax ax-scale d2" title="SuitePad"><div class="plog-mark"><span class="accent">&#9632;</span> SuitePad</div><div class="plog-sub">Hospitality Tech</div></li>
      <li class="plog ax ax-up d3" title="Planet Oat"><div class="plog-mark" style="font-family:var(--Fs);font-style:italic;font-size:20px;">Planet Oat</div><div class="plog-sub">Food &amp; Beverage</div></li>
      <li class="plog ax ax-scale d4" title="Heinz"><div class="plog-mark">HEINZ</div><div class="plog-sub">Consumer Brands</div></li>
      <li class="plog ax ax-up d5" title="Carvana"><div class="plog-mark" style="letter-spacing:1px;">carvana</div><div class="plog-sub" style="border-top:2px solid var(--coral);padding-top:4px;margin-top:2px;">Automotive</div></li>
    </ul>
  </div>
</section>

<!-- STICKY STATEMENT -->
<div id="ss" aria-hidden="true">
  <div class="ssi" id="ssI">
    <canvas id="ss-canvas"></canvas>
    <div class="ss-vignette"></div>
    <div class="sstxt">
      <span class="ss-line"><span class="w" data-i="0">Most</span>&nbsp;<span class="w" data-i="1">hotel</span>&nbsp;<span class="w" data-i="2">content</span></span>
      <span class="ss-line"><span class="w" data-i="3">is</span>&nbsp;<span class="w" data-i="4">a</span>&nbsp;<span class="w" data-i="5">one-time</span>&nbsp;<span class="w" data-i="6">expense</span></span>
      <span class="ss-line"><span class="w cr" data-i="7"><em>that</em></span>&nbsp;<span class="w cr" data-i="8"><em>solves</em></span>&nbsp;<span class="w cr" data-i="9"><em>nothing</em></span>&nbsp;<span class="w cr" data-i="10"><em>long</em></span>&nbsp;<span class="w cr" data-i="11"><em>term.</em></span></span>
    </div>
    <div class="ssdots"><div class="sdot" id="sd1"></div><div class="sdot" id="sd2"></div><div class="sdot" id="sd3"></div></div>
  </div>
</div>

<!-- VALUE -->
<section class="sec sec-alt" aria-labelledby="val-h">
  <div class="inner">
    <div class="vi">
      <div>
        <span class="eyebrow ax ax-left">Why Hotels Partner With Us</span>
        <h2 class="hl ax ax-up d1" id="val-h">Not a Vendor.<br>A <em>Partner.</em></h2>
      </div>
      <div class="ax ax-blur d2" style="padding-top:8px;">
        <p class="body-lg">The typical vendor relationship: you spend the budget, get a video, and six months later the content is stale and you&rsquo;re back at square one. <strong>The shoot solved the immediate problem but nothing downstream changed.</strong></p>
        <p class="body-lg" style="margin-top:16px;">JMEDIA works differently. We plug into your property on an ongoing basis &mdash; building a content library that serves your OTA listings, social channels, email campaigns, and direct booking page simultaneously.</p>
      </div>
    </div>
    <div class="vgrid" role="list">
      <article class="vc ax ax-spin" role="listitem"><div class="vcn" aria-hidden="true">01</div><h3 class="vct">Content That Stacks</h3><p class="vcb">A single shoot produces assets across every channel &mdash; brand film, OTA cuts, social reels, stills, email headers. Your investment compounds every month.</p></article>
      <article class="vc ax ax-flip d2" role="listitem"><div class="vcn" aria-hidden="true">02</div><h3 class="vct">Lean and Agile</h3><p class="vcb">We show up focused, move fast, and deliver cinematic results with a small footprint &mdash; so we can work consistently without disrupting operations.</p></article>
      <article class="vc ax ax-spin d4" role="listitem"><div class="vcn" aria-hidden="true">03</div><h3 class="vct">Hospitality Is All We Do</h3><p class="vcb">We understand booking funnels, OTA dynamics, and how guests decide before they arrive. That context is built into every brief we write.</p></article>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="sec" aria-labelledby="how-h">
  <div class="inner">
    <span class="eyebrow ax ax-right">How It Works</span>
    <h2 class="hl ax ax-scale d1" id="how-h">The Partnership <em>Model</em></h2>
    <div class="hwgrid">
      <div class="ax ax-left d1"><p class="hwl-p">We scope a monthly engagement around your property&rsquo;s specific needs. <strong>Most partnerships start with a free content audit</strong>, then we build a roadmap and execute from there.</p></div>
      <ol class="hwsteps" aria-label="Partnership steps">
        <li class="hws ax ax-right d1"><div class="hwsn" aria-hidden="true">01</div><div><h3 class="hwst">Free Property Audit</h3><p class="hwsb">We study your content, OTA listings, and comp set. We find the gap between what your property delivers and how it&rsquo;s presenting online. <strong>Costs you nothing.</strong></p></div></li>
        <li class="hws ax ax-right d2"><div class="hwsn" aria-hidden="true">02</div><div><h3 class="hwst">Content Roadmap</h3><p class="hwsb">A content plan tied to your booking calendar and channel priorities. You know exactly what&rsquo;s coming and why.</p></div></li>
        <li class="hws ax ax-right d3"><div class="hwsn" aria-hidden="true">03</div><div><h3 class="hwst">Monthly Execution</h3><p class="hwsb">We show up, capture what the roadmap calls for, and deliver formatted assets for every channel. <strong>Your content library grows every month.</strong></p></div></li>
        <li class="hws ax ax-right d4"><div class="hwsn" aria-hidden="true">04</div><div><h3 class="hwst">Track, Review, Iterate</h3><p class="hwsb">Through your client portal, you track what each piece of content is doing. We adjust based on what&rsquo;s moving your numbers.</p></div></li>
      </ol>
    </div>
  </div>
</section>

<!-- RETAINER -->
<section class="sec sec-alt" style="padding-top:0;" aria-labelledby="ret-h">
  <div class="inner">
    <div class="retcard ax ax-scale">
      <div>
        <span class="rettag">The Partnership Model</span>
        <h2 class="reth" id="ret-h">A Monthly<br>Content Engine<br>for Your <em>Property.</em></h2>
        <p class="rets">No bloated production days. No one-and-done deliverables. A focused, ongoing engagement that keeps your content fresh, your channels active, and your brand above the comp set. <strong>Most properties start seeing traction within 60 days.</strong></p>
        <div class="retcta" style="margin-top:28px;"><a href="contact.html" class="btn-pill">Book a Free Audit</a><a href="services.html" class="btn-lnk">See Services</a></div>
      </div>
      <div class="ax ax-left d2">
        <p class="retil">What a Partnership Includes</p>
        <table class="ret-table" role="presentation"><tbody>
          <tr><td>Monthly Shoot Day</td><td>Targeted, pre-planned, efficient</td></tr>
          <tr><td>Multi-Format Delivery</td><td>OTA, social, web, email</td></tr>
          <tr><td>Content Roadmap</td><td>Tied to your booking calendar</td></tr>
          <tr><td>Brand Consistency</td><td>One visual language, every channel</td></tr>
          <tr><td>Client Portal</td><td>Deliverables, performance data, PMS results</td></tr>
          <tr><td>Quarterly Strategy Review</td><td>Adjust based on what&rsquo;s working</td></tr>
        </tbody></table>
      </div>
    </div>
  </div>
</section>

<!-- PORTAL -->
<section class="sec sec-deep" aria-labelledby="portal-h">
  <div class="inner">
    <div class="pwrap">
      <div>
        <span class="eyebrow ax ax-up">The Client Portal</span>
        <h2 class="hl ax ax-up d1" id="portal-h" style="color:#fff;">See Exactly What<br>Your Content <em>Is Doing.</em></h2>
        <p class="body-lg ax ax-blur d2" style="margin-top:20px;">Most production partners hand you a Dropbox link and disappear. Every JMEDIA partnership includes a dedicated portal where you access deliverables, track performance per video, and see the direct booking impact.</p>
        <p class="body-lg ax ax-up d3" style="margin-top:12px;"><strong>We don&rsquo;t just talk about ROI. We show it to you.</strong></p>
        <div class="pfeats ax ax-left d3">
          <div class="pf"><div class="pfi" aria-hidden="true">&#128193;</div><div><p class="pft">Organized Asset Library</p><p class="pfd">Every deliverable sorted by channel, campaign, and date.</p></div></div>
          <div class="pf"><div class="pfi" aria-hidden="true">&#128202;</div><div><p class="pft">Per-Video Performance</p><p class="pfd">OTA click-through, direct booking lift, and social engagement per asset.</p></div></div>
          <div class="pf"><div class="pfi" aria-hidden="true">&#128279;</div><div><p class="pft">Direct Booking Attribution</p><p class="pfd">Revenue movement tied to specific content &mdash; numbers for ownership.</p></div></div>
        </div>
        <div class="pmsbadge ax ax-spring d4"><div class="pmsdot" aria-hidden="true"></div><p class="pmstxt"><strong>PMS Integration</strong> &mdash; connects to all major property management systems.</p></div>
      </div>
      <div class="ax ax-flip d1" aria-hidden="true">
        <div class="pui" role="img" aria-label="Sample client portal">
          <div class="puich"><div class="puidots"><div class="puid"></div><div class="puid"></div><div class="puid"></div></div><div class="puit">JMEDIA Portal &mdash; The Seaside Resort</div><div class="puil"><div class="puil-d"></div>Live</div></div>
          <div class="puisum"><div class="psm"><div class="psml">Direct Bookings</div><div class="psmv">+34%</div><div class="psmd">&#8593; vs last quarter</div></div><div class="psm"><div class="psml">OTA Click-Through</div><div class="psmv">2.1x</div><div class="psmd">&#8593; since brand film</div></div><div class="psm"><div class="psml">ADR Impact</div><div class="psmv">+$28</div><div class="psmd">&#8593; avg rate lift</div></div></div>
          <div class="puitabs"><div class="puitab on">Deliverables</div><div class="puitab">Analytics</div><div class="puitab">Roadmap</div></div>
          <div class="pvrow"><div class="pvth">&#9654;</div><div class="pvinfo"><div class="pvn">Summer Brand Film &mdash; 90s</div><div class="pvd">Mar 2, 2026</div></div><div class="pvc g"><div class="pvnum">+22%</div><div class="pvtype">Direct lift</div></div><div class="pvc"><div class="pvnum">2.4k</div><div class="pvtype">OTA views</div></div></div>
          <div class="pvrow"><div class="pvth">&#9654;</div><div class="pvinfo"><div class="pvn">Pool &amp; F&amp;B Reel &mdash; 30s</div><div class="pvd">Feb 14, 2026</div></div><div class="pvc"><div class="pvnum">18.4k</div><div class="pvtype">Impressions</div></div><div class="pvc g"><div class="pvnum">+14%</div><div class="pvtype">CVR lift</div></div></div>
          <div class="pvrow"><div class="pvth">&#9654;</div><div class="pvinfo"><div class="pvn">OTA Hero Update &mdash; Stills</div><div class="pvd">Jan 28, 2026</div></div><div class="pvc g"><div class="pvnum">+41%</div><div class="pvtype">OTA CTR</div></div><div class="pvc"><div class="pvnum">892</div><div class="pvtype">Downloads</div></div></div>
          <div class="puispk"><div class="spkh"><div class="spkl">Booking Impact &mdash; 90 Days</div><div class="spkl">Jan &mdash; Mar 2026</div></div><div class="spkbars"><div class="sb lo" style="height:28%"></div><div class="sb lo" style="height:35%"></div><div class="sb lo" style="height:30%"></div><div class="sb md" style="height:44%"></div><div class="sb md" style="height:50%"></div><div class="sb md" style="height:58%"></div><div class="sb md" style="height:54%"></div><div class="sb md" style="height:66%"></div><div class="sb hi" style="height:75%"></div><div class="sb hi" style="height:85%"></div><div class="sb hi" style="height:92%"></div><div class="sb hi" style="height:100%"></div></div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- STATS -->
<section class="sec sec-alt" aria-labelledby="stats-h">
  <div class="inner">
    <div class="stintro ax ax-blur"><h2 class="sr" id="stats-h">About JMEDIA</h2><p>Founded in 2021, built specifically around <strong>hospitality and experience-driven brands.</strong> Every decision &mdash; how we shoot, how we scope, how we structure partnerships &mdash; is designed to work for the way hotels actually operate.</p></div>
    <div class="strow" role="list">
      <div class="stbox ax ax-scale" role="listitem"><div class="stbn" id="cnt-0" data-target="15">0+</div><div class="stbl">Years Experience</div></div>
      <div class="stbox ax ax-flip d2" role="listitem"><div class="stbn" id="cnt-1" data-target="20">0+</div><div class="stbl">Repeat Clients</div></div>
      <div class="stbox ax ax-scale d4" role="listitem"><div class="stbn" id="cnt-2" data-target="100">0+</div><div class="stbl">Projects Delivered</div></div>
      <div class="stbox ax ax-flip d6" role="listitem"><div class="stbn" id="cnt-3" data-target="100">0+</div><div class="stbl">Happy Clients</div></div>
    </div>
  </div>
</section>

<!-- ROI CALCULATOR -->
<section class="roi-sec" aria-labelledby="roi-h">
  <div class="inner">
    <div class="roi-head ax ax-up">
      <span class="eyebrow" style="color:rgba(232,98,90,.9);">ROI Calculator</span>
      <h2 class="hl ax ax-scale d1" id="roi-h">See Your Numbers<br><em>Before You Commit.</em></h2>
      <p class="ax ax-up d2">Drag the sliders. Numbers update instantly. Your OTA dependency gets graded.</p>
    </div>
    <div class="roi-layout">

      <!-- INPUT PANEL -->
      <div class="roi-panel ax ax-left">
        <div class="roi-panel-hd">Your Property</div>

        <div class="roi-field">
          <div class="roi-frow">
            <span class="roi-fname">Number of Rooms</span>
            <span class="roi-fval" id="dv-rooms">120</span>
          </div>
          <input class="roi-sl" type="range" id="sl-rooms" min="20" max="500" value="120" step="5" aria-label="Number of rooms">
          <div class="roi-rlabels"><span>20 rooms</span><span>500 rooms</span></div>
        </div>

        <div class="roi-field">
          <div class="roi-frow">
            <span class="roi-fname">Average Daily Rate</span>
            <span class="roi-fval" id="dv-adr">$185</span>
          </div>
          <input class="roi-sl" type="range" id="sl-adr" min="80" max="800" value="185" step="5" aria-label="Average daily rate">
          <div class="roi-rlabels"><span>$80</span><span>$800</span></div>
        </div>

        <div class="roi-field">
          <div class="roi-frow">
            <span class="roi-fname">OTA Dependency</span>
            <span class="roi-fval" id="dv-ota">55%</span>
          </div>
          <input class="roi-sl" type="range" id="sl-ota" min="10" max="90" value="55" step="1" aria-label="OTA dependency">
          <div class="roi-rlabels"><span>10% &mdash; healthy</span><span>90% &mdash; critical</span></div>
        </div>

        <div class="roi-field">
          <div class="roi-frow">
            <span class="roi-fname">Commission Rate</span>
            <span class="roi-fval" id="dv-comm">18%</span>
          </div>
          <input class="roi-sl" type="range" id="sl-comm" min="12" max="28" value="18" step="1" aria-label="Commission rate">
          <div class="roi-rlabels"><span>12%</span><span>28%</span></div>
        </div>

        <div class="roi-field">
          <div class="roi-frow">
            <span class="roi-fname">Occupancy Rate</span>
            <span class="roi-fval" id="dv-occ">68%</span>
          </div>
          <input class="roi-sl" type="range" id="sl-occ" min="30" max="95" value="68" step="1" aria-label="Occupancy rate">
          <div class="roi-rlabels"><span>30%</span><span>95%</span></div>
        </div>
      </div>

      <!-- RESULTS PANEL -->
      <div class="roi-results ax ax-right">

        <!-- Grade -->
        <div class="roi-grade">
          <div class="roi-gbadge" id="roi-gbadge" style="background:rgba(251,191,36,.15);color:#fbbf24;">C</div>
          <div class="roi-ginfo">
            <div class="roi-glabel">OTA Dependency Grade</div>
            <div class="roi-gtitle" id="roi-gtitle">At Risk</div>
            <div class="roi-gsub" id="roi-gsub">55% via OTA &mdash; significant margin exposure</div>
          </div>
        </div>

        <!-- Achievements -->
        <div class="roi-achs">
          <span class="roi-ach" id="ach-100k"><span class="ach-icon">&#128274;</span> $100k+ Recovery</span>
          <span class="roi-ach" id="ach-5x"><span class="ach-icon">&#128274;</span> 5x+ ROI</span>
          <span class="roi-ach" id="ach-a"><span class="ach-icon">&#128274;</span> Grade A</span>
          <span class="roi-ach" id="ach-dir"><span class="ach-icon">&#128274;</span> Direct Majority</span>
        </div>

        <!-- Metric cards -->
        <div class="roi-cards">
          <div class="roi-card hot">
            <div class="roi-clbl">Annual OTA Commission</div>
            <div class="roi-cval" id="rv-comm">$545,494</div>
            <div class="roi-csub">Currently leaving your property</div>
          </div>
          <div class="roi-card hot">
            <div class="roi-clbl">Recoverable / Year</div>
            <div class="roi-cval" id="rv-rec">$136,373</div>
            <div class="roi-csub">At 25% direct shift</div>
          </div>
          <div class="roi-card">
            <div class="roi-clbl">ADR Lift Potential</div>
            <div class="roi-cval" id="rv-adr">$15/night</div>
            <div class="roi-csub">With premium positioning</div>
          </div>
          <div class="roi-card">
            <div class="roi-clbl">Content ROI</div>
            <div class="roi-cval" id="rv-roi">6x</div>
            <div class="roi-csub">vs. $5k/mo investment</div>
          </div>
        </div>

        <!-- Bar chart -->
        <div class="roi-chart">
          <div class="roi-chtitle">Revenue Breakdown (Annual)</div>
          <div class="roi-bars">
            <div class="roi-brow">
              <div class="roi-blbls"><span>Current Direct</span><span id="rl-dir">$2,479,518</span></div>
              <div class="roi-btrack"><div class="roi-bfill" id="rb-dir" style="width:72.9%;background:#34d399;"></div></div>
            </div>
            <div class="roi-brow">
              <div class="roi-blbls"><span>OTA Revenue</span><span id="rl-ota">$3,030,522</span></div>
              <div class="roi-btrack"><div class="roi-bfill" id="rb-ota" style="width:89.2%;background:var(--coral);"></div></div>
            </div>
            <div class="roi-brow">
              <div class="roi-blbls"><span>Projected Direct After JMEDIA</span><span id="rl-prj">$3,237,148</span></div>
              <div class="roi-btrack"><div class="roi-bfill" id="rb-prj" style="width:95.2%;background:#60a5fa;"></div></div>
            </div>
            <div class="roi-brow">
              <div class="roi-blbls"><span>Commission Paid Out</span><span id="rl-com">$545,494</span></div>
              <div class="roi-btrack"><div class="roi-bfill" id="rb-com" style="width:16%;background:rgba(232,98,90,.5);"></div></div>
            </div>
          </div>
        </div>

        <div class="roi-more"><a href="roi.html" class="roi-mlink">Full 12-month projection</a></div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="sec" aria-labelledby="faq-h">
  <div class="inner">
    <div class="faqwrap">
      <div>
        <span class="eyebrow ax ax-left">Common Questions</span>
        <h2 class="hl ax ax-up d1" id="faq-h">Before You<br><em>Reach Out.</em></h2>
        <p class="faqled ax ax-up d2">Honest answers to what most GMs and marketing directors want to know before getting on a call.</p>
      </div>
      <div class="flist ax ax-right">
        <div class="fi" data-open>
          <button class="fibtn" aria-expanded="true" aria-controls="fa1">How is this different from hiring a production company? <div class="fitog" aria-hidden="true">+</div></button>
          <div class="fans" id="fa1">A production company gives you a deliverable and moves on. We give you an ongoing content strategy tied to your booking goals &mdash; with a portal that shows exactly how each piece is performing. The work compounds month over month.</div>
        </div>
        <div class="fi">
          <button class="fibtn" aria-expanded="false" aria-controls="fa2">We already have vendor relationships. Why add another? <div class="fitog" aria-hidden="true">+</div></button>
          <div class="fans" id="fa2">Most properties start by filling a gap &mdash; social content, seasonal assets, OTA refresh &mdash; and the relationship grows from there. We come in with a plan tied to your booking goals, not just a camera and an invoice.</div>
        </div>
        <div class="fi">
          <button class="fibtn" aria-expanded="false" aria-controls="fa3">Can we start with a single project before committing? <div class="fitog" aria-hidden="true">+</div></button>
          <div class="fans" id="fa3">Yes. A brand film or OTA content refresh is a common starting point. We approach every project with the same strategy-first process. Most clients continue because the results make the case.</div>
        </div>
        <div class="fi">
          <button class="fibtn" aria-expanded="false" aria-controls="fa4">How disruptive is a shoot day for the property? <div class="fitog" aria-hidden="true">+</div></button>
          <div class="fans" id="fa4">Minimal. A typical shoot involves 1&ndash;2 people, planned around your quieter operational windows. Guests often don&rsquo;t notice we&rsquo;re there.</div>
        </div>
        <div class="fi">
          <button class="fibtn" aria-expanded="false" aria-controls="fa5">How do I actually measure the impact? <div class="fitog" aria-hidden="true">+</div></button>
          <div class="fans" id="fa5">Through your client portal. Every asset is tracked &mdash; OTA click-through, direct booking attribution, social engagement. We connect to your PMS so you can see booking movement tied to specific content.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="ctasec" aria-labelledby="cta-h">
  <div class="inner">
    <span class="ctaey ax ax-up">No Commitment Required</span>
    <h2 class="ctah ax ax-scale d1" id="cta-h">Stop Paying<br>for <em>One-Off Shoots.</em></h2>
    <p class="ctasub ax ax-blur d2">We&rsquo;ll audit your current content and show you exactly where the gap is &mdash; before you spend a dollar.</p>
    <div class="ctabtns ax ax-spring d3"><a href="contact.html" class="btn-pill">Book a Free Audit</a><a href="services.html" class="btn-ghost-dk">See How It Works</a></div>
  </div>
</section>

</main>

<!-- FOOTER -->
<footer>
  <div class="inner">
    <div class="fg">
      <div class="ax ax-up">
        <img src="jmedia-logo.png" alt="JMEDIA Productions" class="flogo-img">
        <p class="ftagl">Ongoing cinematic content for hotels, resorts, and experience-driven brands. Based in Orlando, FL.</p>
        <nav aria-label="Social links"><div class="fsocs"><a href="#" class="fsoc" aria-label="Instagram">IG</a><a href="#" class="fsoc" aria-label="YouTube">YT</a><a href="#" class="fsoc" aria-label="LinkedIn">LI</a></div></nav>
      </div>
      <div class="ax ax-up d2"><p class="fch">Navigate</p><ul class="fl"><li><a href="services.html">Services</a></li><li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li></ul></div>
      <div class="ax ax-up d4"><p class="fch">Services</p><ul class="fl"><li><a href="services.html">Content Partnerships</a></li><li><a href="services.html">Brand Films</a></li><li><a href="services.html">OTA Visuals</a></li><li><a href="services.html">Social Content</a></li></ul></div>
      <div class="ax ax-up d6"><p class="fch">Contact</p><ul class="fl"><li><a href="/cdn-cgi/l/email-protection#d8b1b6beb798b2f5b5bdbcb1b9a8aab7bcadbbacb1b7b6abf6bbb7b5"><span class="__cf_email__" data-cfemail="f49d9a929bb49ed99991909d9584869b908197809d9b9a87da979b99">[email&#160;protected]</span></a></li><li><a href="tel:8638878129">(863) 887-8129</a></li><li><span>4700 Millennium Blvd, Suite 175</span></li><li><span>Orlando, FL 32839</span></li></ul></div>
    </div>
    <div class="fbot"><span>&copy; 2026 JMEDIA Productions LLC. All rights reserved.</span><span>Privacy &middot; Terms</span></div>
  </div>
</footer>

<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script><script>
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
</script>
</body>
</html>
