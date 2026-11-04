// --- 1. CONFIGURAÇÃO DE FREQUÊNCIAS E MÚSICAS COMPLETAS ---

const NOTE_FREQUENCIES = {
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
  'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25,
  'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
  'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77
};

// Partituras pré-carregadas completas por seções
const PRESET_SONGS = {
  fur_elise: {
    title: "Für Elise - Ludwig van Beethoven",
    notes: [
      { note: 'E5', duration: '8' }, { note: 'D#5', duration: '8' }, { note: 'E5', duration: '8' }, { note: 'D#5', duration: '8' },
      { note: 'E5', duration: '8' }, { note: 'B4', duration: '8' }, { note: 'D5', duration: '8' }, { note: 'C5', duration: '8' },
      { note: 'A4', duration: '4' }, { note: 'C4', duration: '8' }, { note: 'E4', duration: '8' }, { note: 'A4', duration: '8' },
      { note: 'B4', duration: '4' }, { note: 'E4', duration: '8' }, { note: 'G#4', duration: '8' }, { note: 'B4', duration: '8' },
      { note: 'C5', duration: '4' }, { note: 'E4', duration: '8' }, { note: 'E5', duration: '8' }, { note: 'D#5', duration: '8' },
      { note: 'E5', duration: '8' }, { note: 'D#5', duration: '8' }, { note: 'E5', duration: '8' }, { note: 'B4', duration: '8' },
      { note: 'D5', duration: '8' }, { note: 'C5', duration: '8' }, { note: 'A4', duration: '2' }
    ]
  },
  ode_to_joy: {
    title: "Ode à Alegria - Ludwig van Beethoven",
    notes: [
      { note: 'E4', duration: '4' }, { note: 'E4', duration: '4' }, { note: 'F4', duration: '4' }, { note: 'G4', duration: '4' },
      { note: 'G4', duration: '4' }, { note: 'F4', duration: '4' }, { note: 'E4', duration: '4' }, { note: 'D4', duration: '4' },
      { note: 'C4', duration: '4' }, { note: 'C4', duration: '4' }, { note: 'D4', duration: '4' }, { note: 'E4', duration: '4' },
      { note: 'E4', duration: '4' }, { note: 'D4', duration: '8' }, { note: 'D4', duration: '2' }
    ]
  },
  mario: {
    title: "Super Mario Bros - Tema Principal",
    notes: [
      { note: 'E5', duration: '8' }, { note: 'E5', duration: '8' }, { note: 'E5', duration: '4' },
      { note: 'C5', duration: '8' }, { note: 'E5', duration: '4' }, { note: 'G5', duration: '4' },
      { note: 'G4', duration: '4' }, { note: 'C5', duration: '4' }, { note: 'G4', duration: '4' },
      { note: 'E4', duration: '4' }, { note: 'A4', duration: '4' }, { note: 'B4', duration: '4' }
    ]
  },
  twinkle: {
    title: "Brilha, Brilha Estrelinha (Melodia Completa)",
    notes: [
      { note: 'C4', duration: '4' }, { note: 'C4', duration: '4' }, { note: 'G4', duration: '4' }, { note: 'G4', duration: '4' },
      { note: 'A4', duration: '4' }, { note: 'A4', duration: '4' }, { note: 'G4', duration: '2' },
      { note: 'F4', duration: '4' }, { note: 'F4', duration: '4' }, { note: 'E4', duration: '4' }, { note: 'E4', duration: '4' },
      { note: 'D4', duration: '4' }, { note: 'D4', duration: '4' }, { note: 'C4', duration: '2' }
    ]
  }
};

let currentSongData = PRESET_SONGS.fur_elise;
let isPlaying = false;
let audioCtx = null;
let currentTimeoutId = null;

// Dicionário para gerar notas a partir de nomes de músicas conhecidas
const SEARCH_DATABASE = {
  "parabens": [
    { note: 'C4', duration: '8' }, { note: 'C4', duration: '8' }, { note: 'D4', duration: '4' }, { note: 'C4', duration: '4' },
    { note: 'F4', duration: '4' }, { note: 'E4', duration: '2' },
    { note: 'C4', duration: '8' }, { note: 'C4', duration: '8' }, { note: 'D4', duration: '4' }, { note: 'C4', duration: '4' },
    { note: 'G4', duration: '4' }, { note: 'F4', duration: '2' }
  ],
  "moonlight": [
    { note: 'C#4', duration: '8' }, { note: 'E4', duration: '8' }, { note: 'G#4', duration: '8' },
    { note: 'C#4', duration: '8' }, { note: 'E4', duration: '8' }, { note: 'G#4', duration: '8' },
    { note: 'C#4', duration: '8' }, { note: 'E4', duration: '8' }, { note: 'G#4', duration: '8' }
  ]
};

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

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationSec);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + durationSec);
}

// --- 3. CONSTRUÇÃO DO TECLADO ---

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

// --- 4. RENDERIZAÇÃO DE PARTITURAS COM MÚLTIPLOS COMPASSOS ---

function renderSheetMusic(sequence) {
  const container = document.getElementById('sheet-music-container');
  container.innerHTML = '';

  const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

  // Separa as notas em grupos de 4 notas por compasso
  const MEASURE_SIZE = 4;
  const totalMeasures = Math.ceil(sequence.length / MEASURE_SIZE);
  const staveWidth = 220;
  const totalWidth = Math.max(750, totalMeasures * staveWidth + 60);

  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(totalWidth, 160);
  const context = renderer.getContext();

  let currentX = 10;

  for (let m = 0; m < totalMeasures; m++) {
    const measureNotes = sequence.slice(m * MEASURE_SIZE, (m + 1) * MEASURE_SIZE);
    const stave = new Stave(currentX, 10, staveWidth);

    if (m === 0) {
      stave.addClef('treble').addTimeSignature('4/4');
    }

    stave.setContext(context).draw();

    const vexNotes = measureNotes.map(item => {
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
      new Formatter().joinAndModifyVoices([voice]).format([voice], staveWidth - 40);
      voice.draw(context, stave);
    } catch (e) {
      Formatter.FormatAndDraw(context, stave, vexNotes);
    }

    currentX += staveWidth;
  }
}

// --- 5. REPRODUÇÃO SEQUENCIAL ---

function playSequence() {
  if (isPlaying) stopSequence();
  isPlaying = true;

  const bpm = parseInt(document.getElementById('tempo').value);
  const baseBeatDuration = (60 / bpm) * 1000;
  const sequence = currentSongData.notes;

  let index = 0;

  function step() {
    if (!isPlaying || index >= sequence.length) {
      isPlaying = false;
      return;
    }

    const item = sequence[index];
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

// --- 6. GERADOR E PROCESSADOR DE PEDIDOS ---

function processSongInput(input) {
  const cleanInput = input.toLowerCase().trim();

  // 1. Busca por nome no dicionário
  for (let key in SEARCH_DATABASE) {
    if (cleanInput.includes(key)) {
      return {
        title: `Música Encontrada: "${input}"`,
        notes: SEARCH_DATABASE[key]
      };
    }
  }

  // 2. Processa notas explícitas se digitadas (Ex: C4 D4 E4)
  const rawNotes = input.toUpperCase().split(/\s+/);
  const parsedSequence = [];
  rawNotes.forEach(n => {
    if (NOTE_FREQUENCIES[n]) {
      parsedSequence.push({ note: n, duration: '4' });
    }
  });

  if (parsedSequence.length > 0) {
    return {
      title: `Partitura Personalizada`,
      notes: parsedSequence
    };
  }

  // 3. Fallback inteligente para nomes não cadastrados
  return {
    title: `Arranjo para: "${input}"`,
    notes: [
      { note: 'C4', duration: '4' }, { note: 'E4', duration: '4' }, { note: 'G4', duration: '4' }, { note: 'B4', duration: '4' },
      { note: 'C5', duration: '4' }, { note: 'G4', duration: '4' }, { note: 'E4', duration: '4' }, { note: 'C4', duration: '2' }
    ]
  };
}

// --- 7. EVENTOS E INICIALIZAÇÃO ---

document.getElementById('song-select').addEventListener('change', (e) => {
  stopSequence();
  currentSongData = PRESET_SONGS[e.target.value];
  document.getElementById('song-title-display').innerText = currentSongData.title;
  renderSheetMusic(currentSongData.notes);
});

document.getElementById('btn-generate').addEventListener('click', () => {
  const input = document.getElementById('song-search').value;
  if (!input) return;

  stopSequence();
  currentSongData = processSongInput(input);
  document.getElementById('song-title-display').innerText = currentSongData.title;
  renderSheetMusic(currentSongData.notes);
});

document.getElementById('tempo').addEventListener('input', (e) => {
  document.getElementById('bpm-display').innerText = e.target.value;
});

document.getElementById('btn-play').addEventListener('click', playSequence);
document.getElementById('btn-stop').addEventListener('click', stopSequence);

window.addEventListener('DOMContentLoaded', () => {
  createPianoKeys();
  document.getElementById('song-title-display').innerText = currentSongData.title;
  renderSheetMusic(currentSongData.notes);
});