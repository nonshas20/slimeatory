"use client";

import { useEffect, useRef } from "react";

const CSS = `
:root{
  --cream:#F6EFE0;
  --cream-2:#FBF7EE;
  --paper:#F1E8D5;
  --ink:#141109;
  --ink-soft:#4B4534;
  --ink-mute:#7A7361;
  --line:#E2D6BC;
  --slime:#B6E84A;
  --slime-deep:#7CB12B;
  --slime-glow:#DCF583;
  --coral:#FF5A47;
  --coral-deep:#E63B2A;
  --peach:#FFC9A6;
  --butter:#FFD96A;
  --font-display:"Fraunces", serif;
  --font-grotesk:"Bricolage Grotesque", sans-serif;
  --font-sans:"Geist", sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{
  background:var(--cream);
  color:var(--ink);
  font-family:var(--font-sans);
  overflow-x:hidden;
  cursor:none;
}
@media(hover:none){body{cursor:auto}}
::selection{background:var(--slime);color:var(--ink)}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}

/* ---------- custom cursor ---------- */
.cur-dot{position:fixed;top:0;left:0;width:9px;height:9px;border-radius:50%;background:var(--ink);z-index:9999;pointer-events:none;transform:translate(-50%,-50%);transition:width .25s,height .25s,background .25s,opacity .25s}
.cur-blob{position:fixed;top:0;left:0;width:46px;height:46px;border-radius:50%;background:var(--slime);z-index:9998;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;filter:blur(6px);opacity:.55;transition:width .35s,height .35s,background .35s,opacity .35s}
.cur-blob.big{width:120px;height:120px;opacity:.8}
.cur-dot.big{width:0;height:0}
@media(hover:none){.cur-dot,.cur-blob{display:none}}

/* ---------- scroll progress ---------- */
.progress{position:fixed;top:0;left:0;height:3px;width:0;background:var(--coral);z-index:1000;transition:width .1s linear}

/* ---------- preloader ---------- */
.pre{position:fixed;inset:0;z-index:9999;background:var(--ink);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1.2rem;transition:transform .9s cubic-bezier(.76,0,.24,1)}
.pre.gone{transform:translateY(-100%)}
.pre-mark{font-family:var(--font-display);font-weight:600;font-size:clamp(2rem,6vw,4rem);color:var(--cream);letter-spacing:-.02em;overflow:hidden}
.pre-mark span{display:inline-block;transform:translateY(110%);animation:preup .8s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes preup{to{transform:translateY(0)}}
.pre-bar{width:min(220px,40vw);height:2px;background:rgba(246,239,224,.2);overflow:hidden;border-radius:2px}
.pre-bar i{display:block;height:100%;width:0;background:var(--slime);animation:load 1.6s cubic-bezier(.6,0,.2,1) forwards}
@keyframes load{to{width:100%}}
.pre-tag{font-family:var(--font-grotesk);font-size:.72rem;letter-spacing:.32em;text-transform:uppercase;color:var(--ink-mute)}

/* ---------- nav ---------- */
.nav{position:fixed;top:0;left:0;right:0;z-index:900;display:flex;align-items:center;justify-content:space-between;padding:1.1rem clamp(1.1rem,4vw,2.6rem);transition:background .4s,backdrop-filter .4s,padding .4s,border-color .4s;border-bottom:1px solid transparent}
.nav.scrolled{background:rgba(246,239,224,.78);backdrop-filter:blur(14px) saturate(1.3);padding:.8rem clamp(1.1rem,4vw,2.6rem);border-color:var(--line)}
.logo{font-family:var(--font-display);font-weight:700;font-size:1.32rem;letter-spacing:-.02em;display:flex;align-items:center;gap:.5rem}
.logo .dot{width:11px;height:11px;border-radius:50%;background:var(--slime);box-shadow:0 0 0 4px rgba(182,232,74,.25);animation:pulse 2.6s ease-in-out infinite}
@keyframes pulse{50%{box-shadow:0 0 0 9px rgba(182,232,74,0)}}
.nav-links{display:flex;gap:2rem;font-family:var(--font-grotesk);font-size:.86rem;font-weight:500}
.nav-links a{position:relative;color:var(--ink-soft);transition:color .25s}
.nav-links a::after{content:"";position:absolute;left:0;bottom:-4px;width:0;height:1.5px;background:var(--coral);transition:width .3s}
.nav-links a:hover{color:var(--ink)}
.nav-links a:hover::after{width:100%}
@media(max-width:760px){.nav-links{display:none}}
.btn{font-family:var(--font-grotesk);font-weight:600;font-size:.84rem;letter-spacing:.01em;padding:.7rem 1.3rem;border-radius:999px;border:1.5px solid var(--ink);background:var(--ink);color:var(--cream);display:inline-flex;align-items:center;gap:.5rem;transition:transform .25s,background .25s,color .25s;will-change:transform}
.btn:hover{background:var(--slime);color:var(--ink);border-color:var(--slime)}
.btn.ghost{background:transparent;color:var(--ink)}
.btn.ghost:hover{background:var(--ink);color:var(--cream);border-color:var(--ink)}

/* ---------- layout helpers ---------- */
.wrap{max-width:1280px;margin:0 auto;padding:0 clamp(1.1rem,4vw,2.6rem)}
section{position:relative}
.eyebrow{font-family:var(--font-grotesk);font-size:.74rem;letter-spacing:.26em;text-transform:uppercase;color:var(--ink-mute);display:inline-flex;align-items:center;gap:.6rem}
.eyebrow::before{content:"";width:22px;height:1px;background:var(--coral)}

/* reveal */
.reveal{opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.2,.8,.2,1),transform .9s cubic-bezier(.2,.8,.2,1)}
.reveal.in{opacity:1;transform:none}
.reveal.d1{transition-delay:.08s}.reveal.d2{transition-delay:.16s}.reveal.d3{transition-delay:.24s}.reveal.d4{transition-delay:.32s}

/* mask reveal for headline words */
.line{display:block;overflow:hidden}
.line>span{display:block;transform:translateY(105%);transition:transform 1s cubic-bezier(.2,.85,.2,1)}
.in .line>span,.hero.in .line>span{transform:translateY(0)}
.hero .line:nth-child(2)>span{transition-delay:.12s}
.hero .line:nth-child(3)>span{transition-delay:.24s}

/* ---------- hero ---------- */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;padding:7rem 0 4rem;overflow:hidden;background:var(--cream)}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;animation:kenburns 26s ease-in-out infinite alternate}
.hero-veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(100deg,rgba(246,239,224,.96) 0%,rgba(246,239,224,.88) 32%,rgba(246,239,224,.4) 64%,rgba(246,239,224,.6) 100%)}
.hero .wrap{position:relative;z-index:2}
.hero-vis{position:relative;z-index:2}
.hero-vis .blob{opacity:.85}
@keyframes kenburns{from{transform:scale(1.04) translate(0,0)}to{transform:scale(1.14) translate(-1.5%,-1.5%)}}
@media(max-width:900px){.hero-veil{background:linear-gradient(180deg,rgba(246,239,224,.92) 0%,rgba(246,239,224,.6) 45%,rgba(246,239,224,.9) 100%)}}
@media(prefers-reduced-motion:reduce){.hero-bg{animation:none}}
.hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:3rem;align-items:center;width:100%}
@media(max-width:900px){.hero-grid{grid-template-columns:1fr;gap:2rem}}
.hero h1{font-family:var(--font-display);font-weight:500;font-size:clamp(3rem,9.5vw,8.4rem);line-height:.93;letter-spacing:-.035em}
.hero h1 em{font-style:italic;font-weight:400;color:var(--coral)}
.hero h1 .goo-word{position:relative;color:var(--ink)}
.hero h1 .goo-word i{position:absolute;inset:0;background:var(--slime);border-radius:48% 52% 55% 45%/50% 46% 54% 50%;z-index:-1;transform:scale(0);transform-origin:center;transition:transform .9s cubic-bezier(.2,.9,.2,1) .5s;animation:morph 6s ease-in-out 1.4s infinite}
.hero.in h1 .goo-word i{transform:scale(1.08)}
@keyframes morph{0%,100%{border-radius:48% 52% 55% 45%/50% 46% 54% 50%}33%{border-radius:55% 45% 48% 52%/45% 55% 45% 55%}66%{border-radius:45% 55% 52% 48%/54% 46% 50% 50%}}
.hero p.lead{font-family:var(--font-grotesk);font-size:clamp(1.05rem,1.4vw,1.22rem);line-height:1.55;color:var(--ink-soft);max-width:30rem;margin:1.6rem 0 2rem}
.hero-cta{display:flex;gap:.8rem;flex-wrap:wrap;align-items:center}
.hero-meta{display:flex;gap:2.4rem;margin-top:3rem;flex-wrap:wrap}
.hero-meta .m{font-family:var(--font-grotesk)}
.hero-meta .m b{font-family:var(--font-display);font-size:1.6rem;font-weight:600;display:block;line-height:1}
.hero-meta .m span{font-size:.78rem;color:var(--ink-mute);letter-spacing:.04em}

/* hero visual : gooey slime blob */
.hero-vis{position:relative;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center}
.blob{position:absolute;border-radius:50%;filter:url(#goo);animation:float 9s ease-in-out infinite}
@keyframes float{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(14px,-18px) scale(1.05)}}
.scrollcue{position:absolute;bottom:1.6rem;left:50%;transform:translateX(-50%);font-family:var(--font-grotesk);font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;color:var(--ink-mute);display:flex;flex-direction:column;align-items:center;gap:.6rem}
.scrollcue i{display:block;width:1px;height:34px;background:var(--ink-mute);position:relative;overflow:hidden}
.scrollcue i::after{content:"";position:absolute;top:0;left:0;width:100%;height:50%;background:var(--coral);animation:cue 1.8s ease-in-out infinite}
@keyframes cue{0%{transform:translateY(-100%)}60%,100%{transform:translateY(200%)}}

/* ---------- marquee ---------- */
.marq{background:var(--ink);color:var(--cream);padding:1.1rem 0;overflow:hidden;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.marq-track{display:flex;gap:3rem;white-space:nowrap;width:max-content;animation:scroll 26s linear infinite}
.marq:hover .marq-track{animation-play-state:paused}
@keyframes scroll{to{transform:translateX(-50%)}}
.marq-track span{font-family:var(--font-display);font-style:italic;font-weight:400;font-size:clamp(1.4rem,3vw,2.2rem);display:inline-flex;align-items:center;gap:3rem}
.marq-track span::after{content:"✦";color:var(--slime);font-style:normal}

/* ---------- about ---------- */
.about{padding:8rem 0}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,6vw,6rem);align-items:start}
@media(max-width:860px){.about-grid{grid-template-columns:1fr}}
.about h2{font-family:var(--font-display);font-weight:500;font-size:clamp(2.2rem,5.2vw,4.4rem);line-height:1;letter-spacing:-.025em;margin-top:1.4rem}
.about h2 em{font-style:italic;color:var(--coral)}
.about-text{position:sticky;top:7rem}
.about-body p{font-family:var(--font-grotesk);font-size:1.08rem;line-height:1.65;color:var(--ink-soft);margin-bottom:1.4rem;max-width:34rem}
.about-body p:first-child::first-letter{font-family:var(--font-display);font-size:3.4rem;float:left;line-height:.85;padding:.2rem .5rem 0 0;color:var(--coral);font-weight:600}
.about-feats{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:2rem}
.feat{border:1px solid var(--line);border-radius:18px;padding:1.2rem;background:var(--cream-2);transition:transform .3s,box-shadow .3s}
.feat:hover{transform:translateY(-4px);box-shadow:0 18px 40px -24px rgba(20,17,9,.4)}
.feat b{font-family:var(--font-display);font-weight:600;font-size:1.05rem;display:block;margin-bottom:.3rem}
.feat span{font-size:.86rem;color:var(--ink-mute);line-height:1.45}
.drip{position:absolute;top:0;right:6%;width:14px;height:120px;background:linear-gradient(var(--slime),var(--slime-deep));border-radius:0 0 8px 8px}
.drip::after{content:"";position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);width:28px;height:28px;border-radius:50%;background:var(--slime-deep)}

/* ---------- products ---------- */
.products{padding:7rem 0;background:var(--paper);position:relative;overflow:hidden}
.products-head{display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;margin-bottom:3rem;flex-wrap:wrap}
.products-head h2{font-family:var(--font-display);font-weight:500;font-size:clamp(2.2rem,5vw,4rem);line-height:.98;letter-spacing:-.025em;margin-top:1rem}
.products-head h2 em{font-style:italic;color:var(--coral)}
.prod-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem}
@media(max-width:900px){.prod-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.prod-grid{grid-template-columns:1fr}}
.card{position:relative;border-radius:24px;overflow:hidden;background:var(--cream-2);border:1px solid var(--line);transition:transform .3s,box-shadow .3s;transform-style:preserve-3d;will-change:transform}
.card:hover{box-shadow:0 30px 60px -30px rgba(20,17,9,.45)}
.card-vis{aspect-ratio:5/4;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--cream)}
.swatch{position:absolute;width:80%;height:80%;border-radius:46% 54% 55% 45%/52% 46% 54% 48%;background-size:cover;background-position:center;box-shadow:inset 0 0 0 1px rgba(20,17,9,.06),0 22px 44px -26px rgba(20,17,9,.55);transition:transform .6s cubic-bezier(.2,.8,.2,1),border-radius .6s}
.card:hover .swatch{transform:scale(1.08) rotate(3deg);border-radius:52% 48% 45% 55%/48% 52% 48% 52%}
.card-vis::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.25),transparent 50%);pointer-events:none;mix-blend-mode:overlay}
.card-tag{position:absolute;top:1rem;left:1rem;font-family:var(--font-grotesk);font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;background:var(--ink);color:var(--cream);padding:.35rem .7rem;border-radius:999px;z-index:2}
.card-body{padding:1.3rem 1.4rem 1.5rem;display:flex;justify-content:space-between;align-items:flex-end;gap:1rem}
.card-body h3{font-family:var(--font-display);font-weight:600;font-size:1.45rem;letter-spacing:-.01em;line-height:1.05}
.card-body .t{font-family:var(--font-grotesk);font-size:.78rem;color:var(--ink-mute);margin-top:.25rem}
.price{font-family:var(--font-display);font-weight:600;font-size:1.2rem}
.add{position:absolute;inset:auto 1.4rem 1.4rem 1.4rem;display:flex;align-items:center;justify-content:space-between;background:var(--ink);color:var(--cream);padding:.85rem 1.1rem;border-radius:14px;transform:translateY(140%);opacity:0;transition:transform .4s cubic-bezier(.2,.8,.2,1),opacity .4s;z-index:3}
.card:hover .add{transform:translateY(0);opacity:1}
.add span{font-family:var(--font-grotesk);font-weight:600;font-size:.86rem}
.add i{width:30px;height:30px;border-radius:50%;background:var(--slime);color:var(--ink);display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:700}

/* ---------- process (scroll storytelling) ---------- */
.process{padding:8rem 0;overflow:hidden}
.process-head{display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;margin-bottom:4rem;flex-wrap:wrap}
.process-head h2{font-family:var(--font-display);font-weight:500;font-size:clamp(2.2rem,5vw,4rem);line-height:.98;letter-spacing:-.025em;margin-top:1rem}
.process-head h2 em{font-style:italic;color:var(--coral)}
.story{display:grid;grid-template-columns:.92fr 1.08fr;gap:clamp(2rem,6vw,5rem);align-items:start}
@media(max-width:880px){.story{grid-template-columns:1fr;gap:0}}
.story-vis{position:sticky;top:6.5rem;height:74vh;border-radius:26px;overflow:hidden;background:var(--cream-2);border:1px solid var(--line);box-shadow:0 40px 80px -50px rgba(20,17,9,.5)}
@media(max-width:880px){.story-vis{display:none}}
.story-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.1);transition:opacity 1s cubic-bezier(.2,.8,.2,1),transform 1.6s cubic-bezier(.2,.8,.2,1)}
.story-img.active{opacity:1;transform:scale(1)}
.story-veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(20,17,9,0) 35%,rgba(20,17,9,.62) 100%)}
.story-meta{position:absolute;left:1.5rem;bottom:1.4rem;right:1.5rem;z-index:2;color:var(--cream);display:flex;justify-content:space-between;align-items:flex-end;gap:1rem}
.story-meta b{font-family:var(--font-display);font-weight:600;font-size:1.7rem;display:block;line-height:1;letter-spacing:-.01em;transition:opacity .4s}
.story-meta .count{font-family:var(--font-grotesk);font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;opacity:.72}
.dots{display:flex;gap:.4rem;align-items:center}
.dots i{width:7px;height:7px;border-radius:50%;background:rgba(246,239,224,.32);transition:background .35s,width .35s}
.dots i.active{background:var(--slime);width:24px;border-radius:999px}
.steps{display:flex;flex-direction:column}
.step{min-height:64vh;display:flex;flex-direction:column;justify-content:center;padding:1.5rem 0;border-top:1px solid var(--line);position:relative}
.step:first-child{border-top:0}
.step .n{font-family:var(--font-display);font-weight:500;font-size:clamp(2.6rem,5.5vw,4.4rem);color:var(--coral);line-height:1;letter-spacing:-.02em}
.step h3{font-family:var(--font-display);font-weight:600;font-size:clamp(1.7rem,3.2vw,2.6rem);margin-top:.7rem;letter-spacing:-.015em}
.step p{font-family:var(--font-grotesk);color:var(--ink-soft);line-height:1.6;font-size:1.02rem;margin-top:.9rem;max-width:30rem}
.step-img{display:none;margin:1rem 0 1.6rem;border-radius:18px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 20px 40px -26px rgba(20,17,9,.5)}
.step-img img{width:100%;height:100%;object-fit:cover}
@media(max-width:880px){
  .step{min-height:auto;padding:2rem 0}
  .step-img{display:block}
}

/* ---------- stats ---------- */
.stats{background:var(--ink);color:var(--cream);padding:6rem 0;position:relative;overflow:hidden}
.stats::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,rgba(182,232,74,.16),transparent 40%),radial-gradient(circle at 80% 70%,rgba(255,90,71,.16),transparent 40%)}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;position:relative}
@media(max-width:760px){.stat-grid{grid-template-columns:repeat(2,1fr)}}
.stat b{font-family:var(--font-display);font-weight:500;font-size:clamp(3rem,7vw,5.4rem);line-height:.95;letter-spacing:-.03em;display:block}
.stat b .suf{color:var(--slime)}
.stat span{font-family:var(--font-grotesk);font-size:.9rem;color:rgba(246,239,224,.6);letter-spacing:.04em;margin-top:.6rem;display:block}

/* ---------- content/creator ---------- */
.creator{padding:8rem 0}
.creator-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,6vw,5rem);align-items:center}
@media(max-width:860px){.creator-grid{grid-template-columns:1fr}}
.creator h2{font-family:var(--font-display);font-weight:500;font-size:clamp(2.2rem,5vw,4.2rem);line-height:1;letter-spacing:-.025em;margin-top:1.2rem}
.creator h2 em{font-style:italic;color:var(--coral)}
.creator p{font-family:var(--font-grotesk);color:var(--ink-soft);line-height:1.6;margin:1.6rem 0;max-width:32rem}
.player{position:relative;border-radius:26px;overflow:hidden;aspect-ratio:4/5;background:linear-gradient(150deg,var(--peach),var(--coral) 60%,var(--coral-deep));box-shadow:0 40px 80px -40px rgba(230,59,42,.6)}
.player .gl{position:absolute;width:60%;height:60%;border-radius:50%;background:var(--slime-glow);filter:url(#goo);bottom:-10%;left:-10%;animation:float 8s ease-in-out infinite}
.play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:84px;height:84px;border-radius:50%;background:var(--cream);color:var(--ink);display:flex;align-items:center;justify-content:center;cursor:none;transition:transform .3s}
.play:hover{transform:translate(-50%,-50%) scale(1.1)}
.play svg{width:26px;margin-left:3px}
.player-cap{position:absolute;left:1.3rem;bottom:1.3rem;right:1.3rem;display:flex;justify-content:space-between;align-items:flex-end;color:var(--cream);font-family:var(--font-grotesk)}
.player-cap b{font-family:var(--font-display);font-weight:600;font-size:1.2rem;display:block}
.player-cap span{font-size:.78rem;opacity:.85}
.live{display:inline-flex;align-items:center;gap:.4rem;background:rgba(20,17,9,.4);backdrop-filter:blur(6px);padding:.4rem .7rem;border-radius:999px;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase}
.live::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--slime);animation:pulse2 1.4s infinite}
@keyframes pulse2{50%{opacity:.3}}
.creator-list{display:flex;flex-direction:column;gap:0;margin-top:2rem}
.creator-list li{list-style:none;display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-top:1px solid var(--line);font-family:var(--font-grotesk)}
.creator-list li:last-child{border-bottom:1px solid var(--line)}
.creator-list b{font-weight:600}
.creator-list span{color:var(--ink-mute);font-size:.84rem}

/* ---------- testimonials ---------- */
.testi{padding:7rem 0;background:var(--paper);overflow:hidden}
.testi-head{margin-bottom:3rem}
.testi-head h2{font-family:var(--font-display);font-weight:500;font-size:clamp(2.2rem,5vw,4rem);line-height:.98;letter-spacing:-.025em;margin-top:1rem}
.testi-head h2 em{font-style:italic;color:var(--coral)}
.ttrack{display:flex;gap:1.4rem;width:max-content;animation:scroll 40s linear infinite}
.testi:hover .ttrack{animation-play-state:paused}
.tcard{width:min(380px,80vw);background:var(--cream-2);border:1px solid var(--line);border-radius:22px;padding:1.8rem;flex-shrink:0}
.tcard .stars{color:var(--coral);letter-spacing:.15em;font-size:.9rem;margin-bottom:.9rem}
.tcard p{font-family:var(--font-display);font-weight:400;font-size:1.18rem;line-height:1.4;color:var(--ink);letter-spacing:-.005em}
.tcard .who{display:flex;align-items:center;gap:.7rem;margin-top:1.3rem}
.tcard .av{width:38px;height:38px;border-radius:50%;background:var(--slime);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;color:var(--ink);font-size:.9rem}
.tcard .who b{font-family:var(--font-grotesk);font-weight:600;font-size:.9rem;display:block}
.tcard .who span{font-size:.76rem;color:var(--ink-mute)}

/* ---------- cta ---------- */
.cta{padding:8rem 0;text-align:center;position:relative;overflow:hidden}
.cta h2{font-family:var(--font-display);font-weight:500;font-size:clamp(2.8rem,9vw,7.4rem);line-height:.92;letter-spacing:-.035em}
.cta h2 em{font-style:italic;color:var(--coral)}
.cta h2 .gw{position:relative;color:var(--ink);z-index:1}
.cta h2 .gw i{position:absolute;inset:-.1em -.18em;background:var(--slime);border-radius:48% 52% 55% 45%/50% 46% 54% 50%;z-index:-1;transform:scale(0);transition:transform .9s cubic-bezier(.2,.9,.2,1) .3s;animation:morph 7s ease-in-out 1.2s infinite}
.cta.in h2 .gw i{transform:scale(1.05)}
.cta p{font-family:var(--font-grotesk);color:var(--ink-soft);max-width:34rem;margin:1.6rem auto 2.2rem;font-size:1.06rem}
.sub{display:flex;gap:.6rem;max-width:480px;margin:0 auto;background:var(--cream-2);border:1.5px solid var(--ink);border-radius:999px;padding:.45rem .45rem .45rem 1.3rem;align-items:center}
.sub input{flex:1;border:0;background:transparent;outline:0;font-family:var(--font-grotesk);font-size:.95rem;color:var(--ink)}
.sub input::placeholder{color:var(--ink-mute)}
.cta-note{font-family:var(--font-grotesk);font-size:.78rem;color:var(--ink-mute);margin-top:1.2rem}

/* ---------- footer ---------- */
.foot{background:var(--ink);color:var(--cream);padding:5rem 0 2rem;margin-top:auto}
.foot-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:2rem}
@media(max-width:760px){.foot-grid{grid-template-columns:1fr 1fr}}
.foot-brand .logo{color:var(--cream);font-size:1.6rem}
.foot-brand .logo .dot{background:var(--slime)}
.foot-brand p{font-family:var(--font-grotesk);color:rgba(246,239,224,.55);margin-top:1rem;max-width:22rem;font-size:.92rem;line-height:1.55}
.foot h4{font-family:var(--font-grotesk);font-size:.74rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(246,239,224,.5);margin-bottom:1.1rem}
.foot a{display:block;font-family:var(--font-grotesk);color:rgba(246,239,224,.85);padding:.32rem 0;transition:color .2s,transform .2s}
.foot a:hover{color:var(--slime);transform:translateX(4px)}
.foot-bottom{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-top:4rem;padding-top:2rem;border-top:1px solid rgba(246,239,224,.12);font-family:var(--font-grotesk);font-size:.8rem;color:rgba(246,239,224,.5);flex-wrap:wrap}
.foot-bottom .socials{display:flex;gap:1.2rem}
.foot-bottom .socials a{padding:0;color:rgba(246,239,224,.7)}
.foot-bottom .socials a:hover{color:var(--slime)}

/* sticky footer wrapper */
.shell{min-height:100vh;display:flex;flex-direction:column}

/* reduced motion */
@media(prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important}
  .reveal{opacity:1;transform:none}
  .line>span{transform:none}
}
`;

const PRODUCTS = [
  { name: "Cloud Dough",  texture: "Pillowy · holdable",      price: "$18", tag: "Bestseller", img: "/textures/cloud-dough.png" },
  { name: "Glossy Glow",  texture: "Stretchy · mirror shine", price: "$22", tag: "New",        img: "/textures/glossy-glow.png" },
  { name: "Butter Bliss", texture: "Spreadable · airy",       price: "$20", tag: "Fan fav",    img: "/textures/butter-bliss.png" },
  { name: "Jelly Burst",  texture: "Jiggly · clear base",     price: "$24", tag: "Limited",    img: "/textures/jelly-burst.png" },
  { name: "Crunch Stack", texture: "Bubbly · audible",        price: "$21", tag: "ASMR",       img: "/textures/crunch-stack.png" },
  { name: "Magnetic Mud", texture: "Firm · putty",            price: "$26", tag: "Restock",    img: "/textures/magnetic-mud.png" },
];

const STATS = [
  { n: 2, suf: "M+", label: "Jars shipped worldwide" },
  { n: 4.9, suf: "★", label: "Average rating", dec: 1 },
  { n: 180, suf: "+", label: "Original recipes" },
  { n: 12, suf: "M", label: "Community across platforms" },
];

const STEPS = [
  { n: "01", t: "Source",    d: "Skin-safe, US-made ingredients. We test every raw material before it enters the kitchen.", img: "/process/01-source.png" },
  { n: "02", t: "Formulate", d: "180+ recipes, each tuned for stretch, hold, sound, and that addictive hand-feel.",    img: "/process/02-formulate.png" },
  { n: "03", t: "Hand-mix",  d: "Small batches mixed and colored by hand. No two jars are ever perfectly identical.", img: "/process/03-mix.png" },
  { n: "04", t: "Content",   d: "Every batch gets filmed the same day. The texture you see is the texture you get.",  img: "/process/04-content.png" },
  { n: "05", t: "Ship",      d: "Hand-checked, sealed, and out the door within 48 hours of being made.",              img: "/process/05-ship.png" },
];

export default function Home() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const $ = (s: string, el: ParentNode = document) => el.querySelector(s);
    const body = document.body;

    // ---- preloader ----
    const t = setTimeout(() => {
      $(".pre")?.classList.add("gone");
      $(".hero")?.classList.add("in");
      body.classList.add("loaded");
    }, 1700);

    // ---- cursor ----
    const dot = $(".cur-dot") as HTMLElement;
    const blob = $(".cur-blob") as HTMLElement;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let bx = mx, by = my;
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };
    const raf = () => {
      bx += (mx - bx) * 0.16;
      by += (my - by) * 0.16;
      blob.style.transform = `translate(${bx}px,${by}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    };
    raf();
    window.addEventListener("mousemove", move);
    const hoverables = "a,button,.card,.feat,.play,.tcard,[data-magnetic]";
    document.querySelectorAll(hoverables).forEach((el) => {
      el.addEventListener("mouseenter", () => { dot.classList.add("big"); blob.classList.add("big"); });
      el.addEventListener("mouseleave", () => { dot.classList.remove("big"); blob.classList.remove("big"); });
    });

    // ---- scroll progress ----
    const prog = $(".progress") as HTMLElement;
    const nav = $(".nav") as HTMLElement;
    const onScroll = () => {
      const h = document.documentElement;
      const p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      prog.style.width = p + "%";
      nav.classList.toggle("scrolled", h.scrollTop > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ---- reveals ----
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    document.querySelectorAll(".reveal,.cta").forEach((el) => io.observe(el));

    // ---- scroll storytelling (process) ----
    const stepEls = Array.from(document.querySelectorAll<HTMLElement>(".step[data-idx]"));
    const imgs = Array.from(document.querySelectorAll<HTMLElement>(".story-img"));
    const dots = Array.from(document.querySelectorAll<HTMLElement>(".dots i"));
    const cap = $(".story-cap") as HTMLElement | null;
    let sio: IntersectionObserver | null = null;
    const setActive = (idx: number) => {
      imgs.forEach((im, i) => im.classList.toggle("active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
      if (cap && stepEls[idx]) cap.textContent = stepEls[idx].querySelector("h3")?.textContent || "";
    };
    if (stepEls.length) {
      sio = new IntersectionObserver(
        (entries) => {
          // pick the entry closest to viewport center that is intersecting
          let best: { idx: number; dist: number } | null = null;
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const r = e.target.getBoundingClientRect();
            const center = r.top + r.height / 2;
            const dist = Math.abs(center - window.innerHeight / 2);
            const idx = stepEls.indexOf(e.target as HTMLElement);
            if (!best || dist < best.dist) best = { idx, dist };
          });
          if (best && best.idx >= 0) setActive(best.idx);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      stepEls.forEach((s) => sio!.observe(s));
    }

    // ---- counters ----
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const target = parseFloat(el.dataset.count || "0");
          const dec = parseInt(el.dataset.dec || "0");
          const dur = 1600;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target * eased;
            el.firstChild!.textContent = dec ? val.toFixed(dec) : Math.floor(val).toString();
            if (p < 1) requestAnimationFrame(tick);
            else el.firstChild!.textContent = dec ? target.toFixed(dec) : target.toString();
          };
          requestAnimationFrame(tick);
          cio.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

    // ---- magnetic buttons ----
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const node = el as HTMLElement;
      node.addEventListener("mousemove", (e) => {
        const r = node.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        node.style.transform = `translate(${x * 0.25}px,${y * 0.35}px)`;
      });
      node.addEventListener("mouseleave", () => { node.style.transform = ""; });
    });

    // ---- 3D tilt on cards ----
    document.querySelectorAll<HTMLElement>(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });

    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      cio.disconnect();
      sio?.disconnect();
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* SVG goo filter (shared) */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="cur-dot" />
      <div className="cur-blob" />
      <div className="progress" />

      {/* preloader */}
      <div className="pre">
        <div className="pre-mark"><span>Slimeatory</span></div>
        <div className="pre-bar"><i /></div>
        <div className="pre-tag">Small batch · Big obsession</div>
      </div>

      <div className="shell" ref={root}>
        {/* NAV */}
        <nav className="nav">
          <a className="logo" href="#top" data-magnetic>
            <span className="dot" /> Slimeatory
          </a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#products">Shop</a>
            <a href="#process">Process</a>
            <a href="#creator">Studio</a>
          </div>
          <a className="btn" href="#cta" data-magnetic>Shop the drop →</a>
        </nav>

        {/* HERO */}
        <header className="hero reveal" id="top">
          <video className="hero-bg" autoPlay muted loop playsInline preload="auto" poster="/hero-bg-poster.jpg" aria-hidden="true">
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="hero-veil" aria-hidden="true" />
          <div className="wrap" style={{ width: "100%" }}>
            <div className="hero-grid">
              <div>
                <span className="eyebrow">Handcrafted in small batches</span>
                <h1 style={{ marginTop: "1.4rem" }}>
                  <span className="line"><span>Slime worth</span></span>
                  <span className="line"><span><em>obsessing</em> over,</span></span>
                  <span className="line"><span className="goo-word">hands<i></i>down.</span></span>
                </h1>
                <p className="lead">
                  Slimeatory blends artisan craft, viral content, and an unreasonable
                  obsession with quality into every jar we ship. Made by hand. Made to be felt.
                </p>
                <div className="hero-cta">
                  <a className="btn" href="#products" data-magnetic>Shop the collection</a>
                  <a className="btn ghost" href="#process" data-magnetic>Watch us make it</a>
                </div>
                <div className="hero-meta">
                  <div className="m"><b>180+</b><span>original recipes</span></div>
                  <div className="m"><b>4.9★</b><span>avg across 40k reviews</span></div>
                  <div className="m"><b>2-day</b><span>small-batch fresh</span></div>
                </div>
              </div>
              <div className="hero-vis" aria-hidden="true">
                <div className="blob" style={{ width: "62%", height: "62%", left: "12%", top: "14%", background: "var(--slime)" }} />
                <div className="blob" style={{ width: "34%", height: "34%", right: "8%", top: "8%", background: "var(--coral)" }} />
                <div className="blob" style={{ width: "26%", height: "26%", right: "16%", bottom: "10%", background: "var(--butter)" }} />
                <div className="blob" style={{ width: "18%", height: "18%", left: "26%", bottom: "16%", background: "var(--peach)" }} />
              </div>
            </div>
          </div>
          <div className="scrollcue">Scroll<i /></div>
        </header>

        {/* MARQUEE */}
        <div className="marq" aria-hidden="true">
          <div className="marq-track">
            <span>Small batch</span><span>Viral content</span><span>Obsessive quality</span><span>Hand mixed</span><span>Made to be felt</span>
            <span>Small batch</span><span>Viral content</span><span>Obsessive quality</span><span>Hand mixed</span><span>Made to be felt</span>
          </div>
        </div>

        {/* ABOUT */}
        <section className="about" id="about">
          <div className="wrap">
            <span className="drip" aria-hidden="true" />
            <div className="about-grid">
              <div className="about-text reveal">
                <span className="eyebrow">Our story</span>
                <h2>Born in a bedroom. Built into a <em>movement.</em></h2>
              </div>
              <div className="about-body reveal d1">
                <p>
                  Slimeatory started on a kitchen counter with a single hand-mixed batch
                  and a phone propped on a stack of books. What began as a hobby turned into
                  a content engine, a fulfillment operation, and a community that shows up
                  for every drop.
                </p>
                <p>
                  We operate at the intersection of eCommerce, content production, and
                  customer experience — and we expect excellence from every system we ship.
                  Our website, our backend, our packaging: all part of the product.
                </p>
                <div className="about-feats">
                  <div className="feat"><b>Made fresh</b><span>Small batches mixed weekly, never warehoused stale.</span></div>
                  <div className="feat"><b>Content first</b><span>Every product is built to be filmed, felt, and shared.</span></div>
                  <div className="feat"><b>Quality obsessed</b><span>Each jar is hand-checked before it ever ships.</span></div>
                  <div className="feat"><b>Systems that scale</b><span>Backend and site built for serious growth.</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="products" id="products">
          <div className="wrap">
            <div className="products-head reveal">
              <div>
                <span className="eyebrow">The collection</span>
                <h2>Textures you can <em>feel</em> through the screen.</h2>
              </div>
              <a className="btn ghost" href="#cta" data-magnetic>View all 180+ →</a>
            </div>
            <div className="prod-grid">
              {PRODUCTS.map((p, i) => (
                <article className="card tilt reveal" style={{ transitionDelay: `${i * 0.06}s` }} key={p.name}>
                  <div className="card-vis">
                    <span className="card-tag">{p.tag}</span>
                    <div className="swatch" style={{ backgroundImage: `url(${p.img})` }} />
                  </div>
                  <div className="card-body">
                    <div>
                      <h3>{p.name}</h3>
                      <div className="t">{p.texture}</div>
                    </div>
                    <div className="price">{p.price}</div>
                  </div>
                  <div className="add"><span>Add to cart</span><i>+</i></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS — scroll storytelling */}
        <section className="process" id="process">
          <div className="wrap">
            <div className="process-head reveal">
              <div>
                <span className="eyebrow">From kitchen to carton</span>
                <h2>How a jar of Slimeatory <em>gets made.</em></h2>
              </div>
            </div>
            <div className="story">
              {/* sticky image panel (desktop) */}
              <div className="story-vis reveal" aria-hidden="true">
                {STEPS.map((s, i) => (
                  <img key={s.n} className={`story-img${i === 0 ? " active" : ""}`} data-idx={i} src={s.img} alt="" loading="eager" />
                ))}
                <div className="story-veil" />
                <div className="story-meta">
                  <b className="story-cap">{STEPS[0].t}</b>
                  <div className="dots">
                    {STEPS.map((s, i) => (
                      <i key={s.n} className={i === 0 ? "active" : ""} />
                    ))}
                  </div>
                </div>
              </div>
              {/* scrolling steps */}
              <div className="steps">
                {STEPS.map((s) => (
                  <div className="step reveal" data-idx={s.n} key={s.n}>
                    <div className="step-img"><img src={s.img} alt={s.t} loading="lazy" /></div>
                    <div className="n">{s.n}</div>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats">
          <div className="wrap">
            <div className="stat-grid">
              {STATS.map((s) => (
                <div className="stat reveal" key={s.label}>
                  <b><span data-count={s.n} data-dec={s.dec || 0}>0</span><span className="suf">{s.suf}</span></b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CREATOR */}
        <section className="creator" id="creator">
          <div className="wrap">
            <div className="creator-grid">
              <div className="reveal">
                <span className="eyebrow">The studio</span>
                <h2>We don't just sell slime. We sell the <em>show.</em></h2>
                <p>
                  Content isn't a side channel — it's the product. Our in-house studio
                  shoots every batch the day it's made, turning texture into a story
                  millions of people tune in for.
                </p>
                <ul className="creator-list">
                  <li><b>In-house content studio</b><span>4k · slow-mo · ASMR</span></li>
                  <li><b>Daily drops</b><span>filmed & shipped same week</span></li>
                  <li><b>Creator program</b><span>200+ partnered creators</span></li>
                  <li><b>Owned audience</b><span>12M across platforms</span></li>
                </ul>
              </div>
              <div className="player reveal d1">
                <div className="gl" />
                <div className="play" data-magnetic>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div className="player-cap">
                  <div>
                    <b>Cloud Dough · fresh batch</b>
                    <span>filmed 2 hrs ago</span>
                  </div>
                  <span className="live">Live drop</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testi">
          <div className="wrap">
            <div className="testi-head reveal">
              <span className="eyebrow">The reviews</span>
              <h2>People are <em>obsessed.</em></h2>
            </div>
          </div>
          <div className="ttrack">
            {[
              { q: "The texture is unreal. I've ordered from a dozen shops and nothing comes close to Slimeatory.", n: "Maya R.", role: "Verified buyer", i: "M" },
              { q: "My package arrived in two days and the slime was still cold from being made. Insane quality.", n: "Devin K.", role: "Repeat customer", i: "D" },
              { q: "Their content got me hooked, the product kept me. Cloud Dough is now my comfort purchase.", n: "Aisha L.", role: "Subscriber", i: "A" },
              { q: "You can tell every jar is hand-checked. No leaks, no defects, perfect stretch every single time.", n: "Sofia M.", role: "Verified buyer", i: "S" },
              { q: "The drops sell out in minutes for a reason. This is the best slime on the internet.", n: "Jordan T.", role: "Collector", i: "J" },
            ].concat([
              { q: "The texture is unreal. I've ordered from a dozen shops and nothing comes close to Slimeatory.", n: "Maya R.", role: "Verified buyer", i: "M" },
              { q: "My package arrived in two days and the slime was still cold from being made. Insane quality.", n: "Devin K.", role: "Repeat customer", i: "D" },
              { q: "Their content got me hooked, the product kept me. Cloud Dough is now my comfort purchase.", n: "Aisha L.", role: "Subscriber", i: "A" },
            ]).map((t, i) => (
              <div className="tcard" key={i}>
                <div className="stars">★★★★★</div>
                <p>“{t.q}”</p>
                <div className="who">
                  <div className="av">{t.i}</div>
                  <div><b>{t.n}</b><span>{t.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta reveal" id="cta">
          <div className="wrap">
            <span className="eyebrow" style={{ marginBottom: "1.4rem" }}>The next drop</span>
            <h2>
              Get your hands<br />
              on the <em>next</em> <span className="gw">drop<i></i></span>.
            </h2>
            <p>Join the list for early access, restock alerts, and members-only batches. No spam — just slime.</p>
            <form className="sub" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@email.com" aria-label="Email" />
              <button className="btn" type="submit" data-magnetic>Notify me →</button>
            </form>
            <div className="cta-note">Join 60,000+ on the early-access list.</div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="foot">
          <div className="wrap">
            <div className="foot-grid">
              <div className="foot-brand">
                <a className="logo" href="#top"><span className="dot" /> Slimeatory</a>
                <p>Handcrafted slime, viral content, and obsessive quality. Made fresh, shipped fast, felt everywhere.</p>
              </div>
              <div>
                <h4>Shop</h4>
                <a href="#products">Bestsellers</a>
                <a href="#products">New arrivals</a>
                <a href="#products">Limited drops</a>
                <a href="#products">Gift cards</a>
              </div>
              <div>
                <h4>Studio</h4>
                <a href="#creator">Content</a>
                <a href="#creator">Creator program</a>
                <a href="#process">How it's made</a>
                <a href="#about">Our story</a>
              </div>
              <div>
                <h4>Support</h4>
                <a href="#cta">Track order</a>
                <a href="#cta">Shipping</a>
                <a href="#cta">Care guide</a>
                <a href="#cta">Contact</a>
              </div>
            </div>
            <div className="foot-bottom">
              <span>© {new Date().getFullYear()} Slimeatory. Hand-mixed with obsession.</span>
              <div className="socials">
                <a href="#creator">Instagram</a>
                <a href="#creator">TikTok</a>
                <a href="#creator">YouTube</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
