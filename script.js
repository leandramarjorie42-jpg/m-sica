// --- ÁUDIO (Web Audio API) ---
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function noteToFreq(note) {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return 440;
  const [, name, octStr] = match;
  const octave = parseInt(octStr, 10);
  const semitone = NOTE_NAMES.indexOf(name);
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function playTone(note, durationSec = 0.5) {
  const ctx = getAudioCtx();
  const freq = noteToFreq(note);
  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'triangle';
  osc2.type = 'sine';
  osc1.frequency.setValueAtTime(freq, now);
  osc2.frequency.setValueAtTime(freq * 2, now);

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.15, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(durationSec, 0.25) + 0.35);

  osc1.connect(gain);
  osc2.connect(subGain);
  subGain.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + durationSec + 0.4);
  osc2.stop(now + durationSec + 0.4);

  highlightKey(note, durationSec * 1000);
}

// --- CONSTRUÇÃO DO PIANO (C2 a C7 - 61 Teclas) ---
const pianoKeysEl = document.getElementById('pianoKeys');
const keyElements = {};

function buildPiano() {
  pianoKeysEl.innerHTML = '';
  let whiteIndex = 0;
  const whiteWidth = 42;

  for (let oct = 2; oct <= 7; oct++) {
    for (let i = 0; i < NOTE_NAMES.length; i++) {
      if (oct === 7 && i > 0) break; // Termina em C7
      const note = NOTE_NAMES[i] + oct;
      const isBlack = note.includes('#');

      const keyDiv = document.createElement('div');
      keyDiv.dataset.note = note;
      keyDiv.textContent = note;

      if (!isBlack) {
        keyDiv.className = 'key-white';
        pianoKeysEl.appendChild(keyDiv);
        whiteIndex++;
      } else {
        keyDiv.className = 'key-black';
        keyDiv.style.left = `${whiteIndex * whiteWidth - 13}px`;
        pianoKeysEl.appendChild(keyDiv);
      }

      keyDiv.addEventListener('mousedown', () => playTone(note, 0.6));
      keyElements[note] = keyDiv;
    }
  }
}

function highlightKey(note, ms = 300) {
  const el = keyElements[note];
  if (!el) return;
  el.classList.add('active');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  setTimeout(() => el.classList.remove('active'), Math.min(ms, 600));
}

function scrollToOctave(oct) {
  const el = keyElements[`C${oct}`];
  if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'start' });
}

// Teclado físico (Oitava 4)
const KEYBOARD_MAP = {
  a: 'C4', w: 'C#4', s: 'D4', e: 'D#4', d: 'E4',
  f: 'F4', t: 'F#4', g: 'G4', y: 'G#4', h: 'A4',
  u: 'A#4', j: 'B4', k: 'C5', o: 'C#5', l: 'D5'
};

window.addEventListener('keydown', (e) => {
  if (document.activeElement.tagName === 'INPUT') return;
  const note = KEYBOARD_MAP[e.key.toLowerCase()];
  if (note && !e.repeat) playTone(note, 0.5);
});

// --- PARTITURAS PRONTAS ---
const PRESETS = {
  fur_elise: {
    title: 'Für Elise - Ludwig van Beethoven',
    notes: [
      ['E5',0.25],['D#5',0.25],['E5',0.25],['D#5',0.25],['E5',0.25],['B4',0.25],['D5',0.25],['C5',0.25],['A4',0.5],
      ['C4',0.25],['E4',0.25],['A4',0.25],['B4',0.5],['E4',0.25],['G#4',0.25],['B4',0.25],['C5',0.5],
      ['E4',0.25],['E5',0.25],['D#5',0.25],['E5',0.25],['D#5',0.25],['E5',0.25],['B4',0.25],['D5',0.25],['C5',0.25],['A4',0.5],
      ['C4',0.25],['E4',0.25],['A4',0.25],['B4',0.5],['E4',0.25],['C5',0.25],['B4',0.25],['A4',0.7]
    ]
  },
  ode_to_joy: {
    title: 'Ode à Alegria - Ludwig van Beethoven',
    notes: [
      ['E4',0.4],['E4',0.4],['F4',0.4],['G4',0.4],['G4',0.4],['F4',0.4],['E4',0.4],['D4',0.4],
      ['C4',0.4],['C4',0.4],['D4',0.4],['E4',0.4],['E4',0.6],['D4',0.2],['D4',0.8],
      ['E4',0.4],['E4',0.4],['F4',0.4],['G4',0.4],['G4',0.4],['F4',0.4],['E4',0.4],['D4',0.4],
      ['C4',0.4],['C4',0.4],['D4',0.4],['E4',0.4],['D4',0.6],['C4',0.2],['C4',0.8]
    ]
  },
  canon_d: {
    title: 'Cânone em Ré - Johann Pachelbel',
    notes: [
      ['F#5',0.5],['E5',0.5],['D5',0.5],['C#5',0.5],['B4',0.5],['A4',0.5],['B4',0.5],['C#5',0.5],
      ['D5',0.5],['C#5',0.5],['B4',0.5],['A4',0.5],['G4',0.5],['F#4',0.5],['G4',0.5],['E4',0.5]
    ]
  },
  nocturne: {
    title: 'Noturno Op. 9 Nº 2 - Frédéric Chopin',
    notes: [
      ['G4',0.4],['E5',0.8],['D5',0.3],['E5',0.3],['D5',0.3],['C5',0.6],['G4',0.4],['E5',0.8],
      ['C5',0.4],['A5',0.8],['G5',0.4],['F5',0.4],['E5',0.4],['D5',0.4],['E5',0.8]
    ]
  }
};

let currentSong = PRESETS.fur_elise;
let isPlaying = false;
let playTimers = [];

const notesContainer = document.getElementById('notesContainer');
const songTitleEl = document.getElementById('songTitle');
const statusBar = document.getElementById('statusBar');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

speedSlider.addEventListener('input', () => {
  speedValue.textContent = `${parseFloat(speedSlider.value).toFixed(1)}x`;
});

function renderSheet(song) {
  currentSong = song;
  songTitleEl.textContent = song.title;
  notesContainer.innerHTML = '';
  song.notes.forEach(([note], idx) => {
    const pill = document.createElement('span');
    pill.className = 'note-pill';
    pill.id = `note-pill-${idx}`;
    pill.textContent = note;
    pill.onclick = () => playTone(note, 0.4);
    notesContainer.appendChild(pill);
  });
}

function stopPlayback() {
  isPlaying = false;
  playTimers.forEach(clearTimeout);
  playTimers = [];
  document.querySelectorAll('.note-pill.active').forEach(el => el.classList.remove('active'));
}

function startPlayback() {
  stopPlayback();
  isPlaying = true;
  const speed = parseFloat(speedSlider.value) || 1.0;
  let elapsed = 0;

  statusBar.textContent = `🎵 Tocando: ${currentSong.title}`;

  currentSong.notes.forEach(([note, dur], idx) => {
    const adjustedDur = dur / speed;
    const timer = setTimeout(() => {
      if (!isPlaying) return;
      playTone(note, adjustedDur);

      document.querySelectorAll('.note-pill.active').forEach(el => el.classList.remove('active'));
      const pill = document.getElementById(`note-pill-${idx}`);
      if (pill) {
        pill.classList.add('active');
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (idx === currentSong.notes.length - 1) {
        setTimeout(() => {
          isPlaying = false;
          statusBar.textContent = `✅ Execução concluída: ${currentSong.title}`;
        }, adjustedDur * 1000);
      }
    }, elapsed * 1000);

    playTimers.push(timer);
    elapsed += adjustedDur;
  });
}

document.getElementById('presetSelect').addEventListener('change', (e) => {
  stopPlayback();
  renderSheet(PRESETS[e.target.value]);
});

document.getElementById('playBtn').addEventListener('click', startPlayback);
document.getElementById('stopBtn').addEventListener('click', () => {
  stopPlayback();
  statusBar.textContent = '⏹ Reprodução parada.';
});

// --- GERENCIAMENTO DA API KEY ---
const apiKeyInput = document.getElementById('apiKeyInput');
const savedKey = localStorage.getItem('gemini_piano_api_key');
if (savedKey) apiKeyInput.value = savedKey;

document.getElementById('saveKeyBtn').addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    statusBar.textContent = '⚠️ Cole uma chave de API válida antes de salvar.';
    return;
  }
  localStorage.setItem('gemini_piano_api_key', key);
  statusBar.textContent = '✅ Chave de API salva no navegador com sucesso!';
});

document.getElementById('clearKeyBtn').addEventListener('click', () => {
  localStorage.removeItem('gemini_piano_api_key');
  apiKeyInput.value = '';
  statusBar.textContent = '🗑️ Chave de API removida.';
});

// --- INTEGRAÇÃO COM GEMINI API ---
document.getElementById('generateBtn').addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();
  const promptText = document.getElementById('aiPromptInput').value.trim();

  if (!apiKey) {
    statusBar.textContent = '⚠️ Insira sua chave de API do Google AI Studio no campo acima.';
    return;
  }
  if (!promptText) {
    statusBar.textContent = '⚠️ Digite o nome de uma música ou estilo para a IA compor.';
    return;
  }

  stopPlayback();
  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  statusBar.textContent = `⏳ Compondo "${promptText}" com Gemini...`;

  const systemInstruction = `Você é um pianista e compositor. Crie uma partitura completa e fiel para piano da música solicitada usando notas entre C2 e C7 (ex: "C4", "F#4", "A4", "D5").
Responda APENAS com um JSON válido neste formato exato, sem markdown e sem texto extra:
{"title":"Nome da Música - Compositor","notes":[["C4",0.4],["E4",0.4],["G4",0.6]]}
Onde cada item em "notes" é [nota, duracao_em_segundos]. Gere entre 24 e 64 notas.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\nMúsica solicitada: ${promptText}` }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro ao conectar com a API do Gemini.');
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    const songData = JSON.parse(cleanJson);

    if (!songData.notes || !Array.isArray(songData.notes)) {
      throw new Error('Formato de partitura inválido retornado pela IA.');
    }

    localStorage.setItem('gemini_piano_api_key', apiKey);
    renderSheet(songData);
    startPlayback();
  } catch (err) {
    statusBar.textContent = `❌ Erro: ${err.message}`;
  } finally {
    btn.disabled = false;
  }
});

// Inicialização
buildPiano();
renderSheet(PRESETS.fur_elise);
setTimeout(() => scrollToOctave(4), 100);
