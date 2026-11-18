// --- 1. FREQUÊNCIAS E MÚSICAS PRÉ-DEFINIDAS ---

const NOTE_FREQUENCIES = {
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
  'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25,
  'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
  'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77
};

const PRESET_SONGS = {
  fur_elise: [
    { note: 'E5', duration: '8' }, { note: 'D#5', duration: '8' },
    { note: 'E5', duration: '8' }, { note: 'D#5', duration: '8' },
    { note: 'E5', duration: '8' }, { note: 'B4', duration: '8' },
    { note: 'D5', duration: '8' }, { note: 'C5', duration: '8' },
    { note: 'A4', duration: '4' }
  ],
  ode_to_joy: [
    { note: 'E4', duration: '4' }, { note: 'E4', duration: '4' },
    { note: 'F4', duration: '4' }, { note: 'G4', duration: '4' },
    { note: 'G4', duration: '4' }, { note: 'F4', duration: '4' },
    { note: 'E4', duration: '4' }, { note: 'D4', duration: '4' }
  ],
  twinkle: [
    { note: 'C4', duration: '4' }, { note: 'C4', duration: '4' },
    { note: 'G4', duration: '4' }, { note: 'G4', duration: '4' },
    { note: 'A4', duration: '4' }, { note: 'A4', duration: '4' },
    { note: 'G4', duration: '2' }
  ],
  mario: [
    { note: 'E5', duration: '8' }, { note: 'E5', duration: '8' },
    { note: 'E5', duration: '8' }, { note: 'C5', duration: '8' },
    { note: 'E5', duration: '4' }, { note: 'G5', duration: '4' }
  ]
};

let currentSequence = PRESET_SONGS.fur_elise;
let isPlaying = false;
let audioCtx = null;
let currentTimeoutId = null;

// --- 2. ÁUDIO (Web Audio API) ---

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(pitch, durationSec = 0.5) {
  initAudio();
  const freq = NOTE_FREQUENCIES[pitch];
  if (!freq) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle'; // Som suave estilo piano
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  // Envelope para timbre de piano
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationSec);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + durationSec);
}

// --- 3. CRIAR O PIANO VISUAL ---

const pianoContainer = document.getElementById('piano');

function createPianoKeys() {
  pianoContainer.innerHTML = '';
  Object.keys(NOTE_FREQUENCIES).forEach(note => {
    const isBlack = note.includes('#');
    const keyEl = document.createElement('div');
    keyEl.className = `key ${isBlack ? 'black' : 'white'}`;
    keyEl.dataset.note = note;

    const label = document.createElement('span');
    label.className = 'key-label';
    label.innerText = note;
    keyEl.appendChild(label);

    keyEl.addEventListener('mousedown', () => {
      playSound(note, 0.6);
      highlightKey(note);
    });

    pianoContainer.appendChild(keyEl);
  });
}

function highlightKey(note) {
  const keyEl = pianoContainer.querySelector(`[data-note="${note}"]`);
  if (keyEl) {
    keyEl.classList.add('active');
    setTimeout(() => keyEl.classList.remove('active'), 300);
  }
}

// --- 4. PARTITURA (VexFlow) ---

function renderSheetMusic(sequence) {
  const container = document.getElementById('sheet-music-container');
  container.innerHTML = '';

  const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(700, 140);
  const context = renderer.getContext();

  const stave = new Stave(10, 10, 680);
  stave.addClef('treble').addTimeSignature('4/4');
  stave.setContext(context).draw();

  const vexNotes = sequence.map(item => {
    let noteName = item.note.substring(0, item.note.length - 1).toLowerCase();
    let octave = item.note.slice(-1);
    let hasAccidental = noteName.includes('#');

    let keyFormatted = noteName.replace('#', '') + '/' + octave;

    let staveNote = new StaveNote({
      keys: [keyFormatted],
      duration: item.duration || '4'
    });

    if (hasAccidental) {
      staveNote.addModifier(new Accidental('#'));
    }

    return staveNote;
  });

  try {
    const voice = new Voice({ num_beats: vexNotes.length, beat_value: 4 });
    voice.addTickables(vexNotes);
    new Formatter().joinAndModifyVoices([voice]).format([voice], 600);
    voice.draw(context, stave);
  } catch (e) {
    Formatter.FormatAndDraw(context, stave, vexNotes);
  }
}

// --- 5. REPRODUÇÃO SEQUENCIAL ---

function playSequence() {
  if (isPlaying) stopSequence();
  isPlaying = true;

  const bpm = parseInt(document.getElementById('tempo').value);
  const baseBeatDuration = (60 / bpm) * 1000;

  let index = 0;

  function step() {
    if (!isPlaying || index >= currentSequence.length) {
      isPlaying = false;
      return;
    }

    const item = currentSequence[index];
    const noteDurationMult = (item.duration === '8') ? 0.5 : (item.duration === '2') ? 2 : 1;
    const noteTimeMs = baseBeatDuration * noteDurationMult;

    playSound(item.note, noteTimeMs / 1000);
    highlightKey(item.note);

    index++;
    currentTimeoutId = setTimeout(step, noteTimeMs);
  }

  step();
}

function stopSequence() {
  isPlaying = false;
  if (currentTimeoutId) clearTimeout(currentTimeoutId);
}

// --- 6. EVENTOS DA PÁGINA ---

document.getElementById('song-select').addEventListener('change', (e) => {
  stopSequence();
  currentSequence = PRESET_SONGS[e.target.value];
  renderSheetMusic(currentSequence);
});

document.getElementById('btn-load-custom').addEventListener('click', () => {
  const input = document.getElementById('custom-notes').value.trim();
  if (!input) return;

  const rawNotes = input.toUpperCase().split(/\s+/);
  const parsedSequence = [];

  rawNotes.forEach(n => {
    if (NOTE_FREQUENCIES[n]) {
      parsedSequence.push({ note: n, duration: '4' });
    }
  });

  if (parsedSequence.length > 0) {
    stopSequence();
    currentSequence = parsedSequence;
    renderSheetMusic(currentSequence);
  } else {
    alert('Nenhuma nota válida. Digite notas como: C4, D#4, E4, C5');
  }
});

document.getElementById('tempo').addEventListener('input', (e) => {
  document.getElementById('bpm-display').innerText = e.target.value;
});

document.getElementById('btn-play').addEventListener('click', playSequence);
document.getElementById('btn-stop').addEventListener('click', stopSequence);

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
  createPianoKeys();
  renderSheetMusic(currentSequence);
});
