import bgmUrl from '../assets/birthday bgm1.mpeg';

const AudioContext = window.AudioContext || window.webkitAudioContext;
let ctx = null;
let bgmAudio = null;
let isPlaying = false;

const AudioSys = {
  init: () => {
    // 1. Initialize Web Audio Context for synthesized SFX (pops, blows, chimes)
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    // 2. Initialize Single Centralized Background Music Element if not already done
    if (!bgmAudio) {
      bgmAudio = new Audio(bgmUrl);
      bgmAudio.loop = true;
      bgmAudio.volume = 0.35; // Soft, premium, cinematic balance
      
      // Keep track of internal state
      bgmAudio.addEventListener('play', () => { isPlaying = true; });
      bgmAudio.addEventListener('pause', () => { isPlaying = false; });
    }
  },
  
  playBGM: () => {
    AudioSys.init();
    if (bgmAudio && bgmAudio.paused) {
      bgmAudio.play().catch(err => {
        console.log("BGM play blocked by browser, waiting for user action.", err);
      });
    }
  },

  pauseBGM: () => {
    if (bgmAudio && !bgmAudio.paused) {
      bgmAudio.pause();
    }
  },

  toggleBGM: () => {
    AudioSys.init();
    if (!bgmAudio) return false;
    
    if (bgmAudio.paused) {
      bgmAudio.play().catch(err => console.log("BGM toggle play blocked", err));
      return true;
    } else {
      bgmAudio.pause();
      return false;
    }
  },

  isBGMPlaying: () => {
    return bgmAudio ? !bgmAudio.paused : false;
  },

  setBGMVolume: (volume) => {
    if (bgmAudio) {
      bgmAudio.volume = Math.max(0, Math.min(1, volume));
    }
  },

  // Synthesized Sound Effects (SFX)
  playPop: () => {
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
    gain.gain.setValueAtTime(1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    osc.start(t);
    osc.stop(t + 0.1);
  },

  playChime: (freq = 800) => {
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    osc.start(t);
    osc.stop(t + 1.5);
  },

  playBlow: () => {
    if (!ctx) return;
    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + 0.8);
    const gain = ctx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
    noise.start(t);
  },

  playExplosion: () => {
    if (!ctx) return;
    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 2.0;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.5));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(100, t);
    filter.frequency.linearRampToValueAtTime(50, t + 2);
    const gain = ctx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 2);
    noise.start(t);
  },
};

export default AudioSys;
