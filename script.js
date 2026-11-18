// ============================================================================
// CONFIGURAÇÃO DA CHAVE API VIA LOCALSTORAGE (Seguro para o GitHub)
// ============================================================================
function getApiKey() {
  return localStorage.getItem("gemini_api_key") || "";
}

// ============================================================================
// 1. GERAÇÃO DAS 5 OITAVAS (C2 até C7 - 61 Teclas)
// ============================================================================
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_FREQUENCIES = {};
const ALL_PIANO_KEYS = [];

function buildFiveOctaves() {
  for (let midi = 36; midi <= 96; midi++) {
    const octave = Math.floor(midi / 12) - 1;
    const noteName = NOTE_NAMES[midi % 12];
    const fullNote = `${noteName}${octave}`;
    const frequency = 440 * Math.pow(2, (midi - 69) / 12);
    
    NOTE_FREQUENCIES[fullNote] = frequency;
    ALL_PIANO_KEYS.push(fullNote);
  }
}

buildFiveOctaves();

// ============================================================================
// 2. BIBLIOTECA DE MÚSICAS COMPLETAS DO SITE
// ============================================================================
const PRESET_SONGS = {
  fur_elise: {
    title: "Für Elise (Completa) - Ludwig van Beethoven",
    notes: [
      { note: 'E5', duration: '8' }, { note: 'D#5', duration: '8' }, { note: 'E5', duration: '8' }, { note: 'D#5', duration: '8' },
      { note: 'E5', duration: '8' }, { note: 'B4', duration: '8' }, { note: 'D5', duration: '8' }, { note: 'C5', duration: '8' },
      { note: 'A4', duration: '4' }, { note: 'C4', duration: '8' }, { note: 'E4', duration: '8' }, { note: 'A4', duration: '8' },
      { note: 'B4', duration: '4' }, { note: 'E4', duration: '8' }, { note: 'G#4', duration: '8' }, { note: 'B4', duration: '8' },
      { note: 'C5', duration: '4' }, { note: 'E4', duration: '8' }, { note: 'E5', duration: '8' }, { note: 'D#5', duration: '8' },
      { note: 'E5', duration: '8' }, { note: 'D#5', duration: '8' }, { note: 'E5', duration: '8' }, { note: 'B4', duration: '8' },
      { note: 'D5', duration: '8' }, { note: 'C5', duration: '8' }, { note: 'A4', duration: '4' }, { note: 'C4', duration: '8' },
      { note: 'E4', duration: '8' }, { note: 'A4', duration: '8' }, { note: 'B4', duration: '4' }, { note: 'E4', duration: '8' },
      { note: 'C5', duration: '8' }, { note: 'B4', duration: '8' }, { note: 'A4', duration: '4' }, { note: 'B4', duration: '8' },
      { note: 'C5', duration: '8' }, { note: 'D5', duration: '8' }, { note: 'E5', duration: '4' }, { note: 'G4', duration: '8' },
      { note: 'F5', duration: '8' }, { note: 'E5', duration: '8' }, { note: 'D5', duration: '4' }, { note: 'F4', duration: '8' },
      { note: 'E5', duration: '8' }, { note: 'D5', duration: '8' }, { note: 'C5', duration: '4' }, { note: 'E4', duration: '8' },
      { note: 'D5', duration: '8' }, { note: 'C5', duration: '8' }, { note: 'B4', duration: '2' }
    ]
  },
  ode_to_joy: {
    title: "Ode à Alegria (Completa) - Ludwig van Beethoven",
    notes: [
      { note: 'E4', duration: '4' }, { note: 'E4', duration: '4' }, { note: 'F4', duration: '4' }, { note: 'G4', duration: '4' },
      { note: 'G4', duration: '4' }, { note: 'F4', duration: '4' }, { note: 'E4', duration: '4' }, { note: 'D4', duration: '4' },
      { note: 'C4', duration: '4' }, { note: 'C4', duration: '4' }, { note: 'D4', duration: '4' }, { note: 'E4', duration: '4' },
      { note: 'E4', duration: '4' }, { note: 'D4', duration: '8' }, { note: 'D4', duration: '2' },
      { note: 'E4', duration: '4' }, { note: 'E4', duration: '4' }, { note: 'F4', duration: '4' }, { note: 'G4', duration: '4' },
      { note: 'G4', duration: '4' }, { note: 'F4', duration: '4' }, { note: 'E4', duration: '4' }, { note: 'D4', duration: '4' },
      { note: 'C4', duration: '4' }, { note: 'C4', duration: '4' }, { note: 'D4', duration: '4' }, { note: 'E4', duration: '4' },
      { note: 'D4', duration: '4' }, { note: 'C4', duration: '8' }, { note: 'C4', duration: '2' },
      { note: 'D4', duration: '4' }, { note: 'D4', duration: '4' }, { note: 'E4', duration: '4' }, { note: 'C4', duration: '4' },
      { note: 'D4', duration: '4' }, { note: 'E4', duration: '8' }, { note: 'F4', duration: '8' }, { note: 'E4', duration: '4' },
      { note: 'C4', duration: '4' }, { note: 'D4', duration: '4' }, { note: 'E4', duration: '8' }, { note: 'F4', duration: '8' },
      { note: 'E4', duration: '4' }, { note: 'D4', duration: '4' }, { note: 'C4', duration: '4' }, { note: 'D4', duration: '4' },
      { note: 'G3', duration: '2' }, { note: 'E4', duration: '4' }, { note: 'E4', duration: '4' }, { note: 'F4', duration: '4' },
      { note: 'G4', duration: '4' }, { note: 'G4', duration: '4' }, { note: 'F4', duration: '4' }, { note: 'E4', duration: '4' },
      { note: 'D4', duration: '4' }, { note: 'C4', duration: '4' }, { note: 'C4', duration: '4' }, { note: 'D4', duration: '4' },
      { note: 'E4', duration: '4' }, { note: 'D4', duration: '4' }, { note: 'C4', duration: '8' }, { note: 'C4', duration: '2' }
    ]
  },
  canon_d: {
    title: "Cânone em Ré Maior - Johann Pachelbel",
    notes: [
      { note: 'F#5', duration: '4' }, { note: 'E5', duration: '4' }, { note: 'D5', duration: '4' }, { note: 'C#5', duration: '4' },
      { note: 'B4', duration: '4' }, { note: 'A4', duration: '4' }, { note: 'B4', duration: '4' }, { note: 'C#5', duration: '4' },
      { note: 'D5', duration: '8' }, { note: 'F#5', duration: '8' }, { note: 'A5', duration: '8' }, { note: 'G5', duration: '8' },
      { note: 'F#5', duration: '8' }, { note: 'D5', duration: '8' }, { note: 'F#5', duration: '8' }, { note: 'E5', duration: '8' },
      { note: 'D5', duration: '8' }, { note: 'B4', duration: '8' }, { note: 'D5', duration: '8' }, { note: 'A5', duration: '8' },
      { note: 'G5', duration: '8' }, { note: 'B5', duration: '8' }, { note: 'A5', duration: '8' }, { note: 'G5', duration: '8' },
      { note: 'F#5', duration: '2' }
    ]
  },
  nocturne: {
    title: "Noturno Op. 9 Nº 2 - Frédéric Chopin",
    notes: [
      { note: 'G4', duration: '8' }, { note: 'E5', duration: '4' }, { note: 'D5', duration: '8' }, { note: 'E5', duration: '8' },
      { note: 'D5', duration: '8' }, { note: 'C5', duration: '4' }, { note: 'G4', duration: '4' }, { note: 'E5', duration: '4' },
      { note: 'C5', duration: '8' }, { note: 'G5', duration: '4' }, { note: 'F5', duration: '8' }, { note: 'E5', duration: '8' },
      { note: 'D5', duration: '8' }, { note: 'E5', duration: '4' }, { note: 'B4', duration: '4' }, { note: 'C5', duration: '2' }
    ]
  }
};

// ============================================================================
// 3. ESTADO DA APLICAÇÃO & SINTETIZADOR DE PIANO (Web Audio API)
// ============================================================================
let currentSongData = PRESET_SONGS.fur_elise;
let isPlaying = false;
let currentIndex = 0;
let audioCtx = null;
let timeoutId = null;
let renderedNoteElements = [];

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playPianoNote(pitch, durationSec = 0.6) {
  initAudio();
  const freq = NOTE_FREQUENCIES[pitch];
  if (!freq) return;

  const now = audioCtx.currentTime;

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc1.type = 'triangle';
  osc2.type = 'sine';

  osc1.frequency.setValueAtTime(freq, now);
  osc2.frequency.setValueAtTime(freq * 2, now);

  const osc2Gain = audioCtx.createGain();
  osc2Gain.gain.setValueAtTime(0.25, now);

  gainNode.gain.setValueAtTime(0.001, now);
  gainNode.gain.linearRampToValueAtTime(0.7, now + 0.015);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec + 0.25);

  osc1.connect(gainNode);
  osc2.connect(osc2Gain);
  osc2Gain.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + durationSec + 0.3);
  osc2.stop(now + durationSec + 0.3);
}

// ============================================================================
// 4. CONSTRUÇÃO DO TECLADO VISUAL DE 5 OITAVAS
// ============================================================================
const pianoEl = document.getElementById('piano');
const pianoWrapper = document.getElementById('piano-wrapper');

function renderFiveOctavePiano() {
  pianoEl.innerHTML = '';
  ALL_PIANO_KEYS.forEach(note => {
    const isBlack = note.includes('#');
    const key = document.createElement('div');
    key.className = `key ${isBlack ? 'black' : 'white'}`;
    key.dataset.note = note;

    const label = document.createElement('span');
    label.className = 'key-label';
    label.innerText = note;
    key.appendChild(label);

    key.addEventListener('mousedown', () => {
      playPianoNote(note, 0.7);
      highlightPianoKey(note, 350);
    });

    pianoEl.appendChild(key);
  });

  setTimeout(() => {
    const c4Key = pianoEl.querySelector('[data-note="C4"]');
    if (c4Key) {
      pianoWrapper.scrollLeft = c4Key.offsetLeft - (pianoWrapper.clientWidth / 2) + 50;
    }
  }, 100);
}

function highlightPianoKey(note, durationMs = 300) {
  const key = pianoEl.querySelector(`[data-note="${note}"]`);
  if (!key) return;

  key.classList.add('active');

  const keyLeft = key.offsetLeft;
  const wrapperLeft = pianoWrapper.scrollLeft;
  const wrapperWidth = pianoWrapper.clientWidth;

  if (keyLeft < wrapperLeft + 40 || keyLeft > wrapperLeft + wrapperWidth - 60) {
    pianoWrapper.scrollTo({
      left: keyLeft - wrapperWidth / 2,
      behavior: 'smooth'
    });
  }

  setTimeout(() => {
    key.classList.remove('active');
  }, durationMs);
}

// ============================================================================
// 5. RENDERIZAÇÃO DA PARTITURA COMPLETA (VexFlow)
// ============================================================================
function renderFullSheetMusic(notesArray) {
  const container = document.getElementById('sheet-music-container');
  container.innerHTML = '';
  renderedNoteElements = [];

  if (!notesArray || notesArray.length === 0) return;

  if (typeof Vex === 'undefined' || !Vex.Flow) {
    container.innerHTML = '<p style="color:#0a0c10;padding:20px;">Erro ao carregar a biblioteca de partituras. Recarregue a página.</p>';
    return;
  }

  const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

  const NOTES_PER_MEASURE = 4;
  const totalMeasures = Math.ceil(notesArray.length / NOTES_PER_MEASURE);
  const measureWidth = 230;
  const totalWidth = Math.max(850, totalMeasures * measureWidth + 60);

  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(totalWidth, 165);
  const context = renderer.getContext();

  let currentX = 15;

  for (let m = 0; m < totalMeasures; m++) {
    const slice = notesArray.slice(m * NOTES_PER_MEASURE, (m + 1) * NOTES_PER_MEASURE);
    const stave = new Stave(currentX, 15, measureWidth);

    if (m === 0) {
      stave.addClef('treble').addTimeSignature('4/4');
    }

    stave.setContext(context).draw();

    const vexNotes = slice.map(item => {
      const cleanNote = item.note.trim();
      const pitchPart = cleanNote.slice(0, -1).toLowerCase();
      const octavePart = cleanNote.slice(-1);
      const hasSharp = pitchPart.includes('#');

      const formattedKey = `${pitchPart.replace('#', '')}/${octavePart}`;
      const validDuration = ['1', '2', '4', '8', '16'].includes(String(item.duration))
        ? String(item.duration)
        : '4';

      const staveNote = new StaveNote({
        keys: [formattedKey],
        duration: validDuration
      });

      if (hasSharp) {
        staveNote.addModifier(new Accidental('#'));
      }

      return staveNote;
    });

    try {
      const voice = new Voice({ num_beats: vexNotes.length, beat_value: 4 });
      voice.setStrict(false);
      voice.addTickables(vexNotes);
      new Formatter().joinAndModifyVoices([voice]).format([voice], measureWidth - 45);
      voice.draw(context, stave);
    } catch (err) {
      Formatter.FormatAndDraw(context, stave, vexNotes);
    }

    currentX += measureWidth;
  }

  renderedNoteElements = Array.from(container.querySelectorAll('.vf-stavenote'));
}

function highlightSheetNote(index) {
  renderedNoteElements.forEach(el => {
    el.querySelectorAll('path, rect').forEach(shape => {
      shape.style.fill = '#000000';
      shape.style.stroke = '#000000';
    });
  });

  const activeEl = renderedNoteElements[index];
  if (activeEl) {
    activeEl.querySelectorAll('path, rect').forEach(shape => {
      shape.style.fill = '#2563eb';
      shape.style.stroke = '#2563eb';
    });
  }
}

// ============================================================================
// 6. GERADOR DE PARTITURAS VIA INTELIGÊNCIA ARTIFICIAL (GEMINI API)
// ============================================================================
async function generateSongWithAI(songPrompt) {
  const statusEl = document.getElementById('status-message');
  const generateBtn = document.getElementById('btn-generate');
  const apiKey = getApiKey();

  if (!apiKey) {
    statusEl.innerHTML = `<span style="color: #60a5fa;">⚠️ Chave API ausente:</span> Cole sua chave no campo acima e clique em "Salvar Chave".`;
    return;
  }

  stopPlayback();
  generateBtn.disabled = true;
  generateBtn.innerText = "Compondo...";
  statusEl.innerText = `🎼 Buscando e escrevendo a partitura completa de "${songPrompt}"...`;

  const systemPrompt = `Você é um pianista e transcritor musical profissional. 
Quando o usuário pedir o nome de uma música, retorne a melodia COMPLETA e reconhecível dela (entre 32 e 64 notas) em formato JSON estrito.
Use apenas notas com sustenido entre C2 e C7 (ex: "C4", "D#4", "F5", "G3"). Não use bemóis (b), converta para sustenido (#).
Para durações use apenas: "2" (mínima), "4" (semínima), "8" (colcheia) ou "16" (semicolcheia).
Responda APENAS com um JSON válido no seguinte formato:
{
  "title": "Nome Oficial da Música - Compositor/Artista",
  "bpm": 110,
  "notes": [
    {"note": "E4", "duration": "4"},
    {"note": "G4", "duration": "8"}
  ]
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Transcreva a música completa para piano: ${songPrompt}` }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const apiMsg = data?.error?.message || "Erro na comunicação com a API.";
      throw new Error(apiMsg);
    }

    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const songJson = JSON.parse(rawText);

    const validNotes = (songJson.notes || [])
      .map(n => ({
        note: String(n.note || '').trim().toUpperCase(),
        duration: String(n.duration || '4').trim()
      }))
      .filter(n => NOTE_FREQUENCIES[n.note]);

    if (validNotes.length === 0) {
      throw new Error("A IA não retornou notas válidas para esta música.");
    }

    currentSongData = {
      title: songJson.title || songPrompt,
      notes: validNotes
    };

    if (songJson.bpm) {
      const clampedBpm = Math.min(220, Math.max(40, parseInt(songJson.bpm, 10) || 110));
      document.getElementById('tempo').value = clampedBpm;
      document.getElementById('bpm-display').innerText = clampedBpm;
    }

    document.getElementById('song-title-display').innerText = currentSongData.title;
    renderFullSheetMusic(currentSongData.notes);
    statusEl.innerText = `✅ Partitura de "${currentSongData.title}" gerada com ${validNotes.length} notas! Clique em Tocar.`;

  } catch (error) {
    console.error("Erro ao gerar música:", error);
    statusEl.innerText = `❌ Erro: ${error.message}`;
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerText = "Gerar Partitura";
  }
}

// ============================================================================
// 7. CONTROLES DE REPRODUÇÃO (PLAY, PAUSE, STOP)
// ============================================================================
function startPlayback() {
  if (isPlaying) return;
  initAudio();
  isPlaying = true;

  const sequence = currentSongData.notes;
  const sheetWrapper = document.getElementById('sheet-scroll');
  document.getElementById('status-message').innerText = `▶ Tocando: ${currentSongData.title}`;

  function playStep() {
    if (!isPlaying) return;

    if (currentIndex >= sequence.length) {
      stopPlayback();
      document.getElementById('status-message').innerText = `⏹ Música finalizada.`;
      return;
    }

    const bpm = parseInt(document.getElementById('tempo').value, 10);
    const beatMs = (60 / bpm) * 1000;
    const item = sequence[currentIndex];

    const durationMultiplier =
      item.duration === '2' ? 2 :
      item.duration === '8' ? 0.5 :
      item.duration === '16' ? 0.25 : 1;

    const noteDurationMs = beatMs * durationMultiplier;

    playPianoNote(item.note, noteDurationMs / 1000);
    highlightPianoKey(item.note, noteDurationMs * 0.85);
    highlightSheetNote(currentIndex);

    const maxScroll = sheetWrapper.scrollWidth - sheetWrapper.clientWidth;
    if (maxScroll > 0 && sequence.length > 1) {
      const progress = currentIndex / (sequence.length - 1);
      sheetWrapper.scrollLeft = progress * maxScroll;
    }

    currentIndex++;
    timeoutId = setTimeout(playStep, noteDurationMs);
  }

  playStep();
}

function pausePlayback() {
  isPlaying = false;
  clearTimeout(timeoutId);
  document.getElementById('status-message').innerText = `❚❚ Pausado na nota ${currentIndex + 1}.`;
}

function stopPlayback() {
  isPlaying = false;
  clearTimeout(timeoutId);
  currentIndex = 0;
  highlightSheetNote(-1);
  document.getElementById('sheet-scroll').scrollLeft = 0;
  document.getElementById('status-message').innerText = `◼ Parado.`;
}

// ============================================================================
// 8. EVENTOS DA INTERFACE
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  renderFiveOctavePiano();
  document.getElementById('song-title-display').innerText = currentSongData.title;
  renderFullSheetMusic(currentSongData.notes);

  const savedKey = localStorage.getItem("gemini_api_key");
  const apiKeyInput = document.getElementById('api-key-input');
  if (savedKey) {
    apiKeyInput.value = savedKey;
    document.getElementById('status-message').innerText = "🔑 Chave API carregada com sucesso do seu navegador. Pronto para gerar músicas!";
  }
});

// Bloco atualizado do botão btn-save-key sem exigência de "AIza"
document.getElementById('btn-save-key').addEventListener('click', () => {
  const keyVal = document.getElementById('api-key-input').value.trim();
  if (keyVal.length > 10) {
    localStorage.setItem("gemini_api_key", keyVal);
    document.getElementById('status-message').innerText = "✅ Chave API salva com segurança no seu navegador!";
  } else {
    alert("Por favor, cole uma chave de API válida.");
  }
});

// Botão para Mostrar / Ocultar Chave
document.getElementById('btn-toggle-key').addEventListener('click', () => {
  const input = document.getElementById('api-key-input');
  input.type = input.type === 'password' ? 'text' : 'password';
});

document.getElementById('song-select').addEventListener('change', (e) => {
  stopPlayback();
  currentSongData = PRESET_SONGS[e.target.value];
  document.getElementById('song-title-display').innerText = currentSongData.title;
  renderFullSheetMusic(currentSongData.notes);
});

const searchForm = document.getElementById('search-form');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const prompt = document.getElementById('song-search').value.trim();
    if (prompt) generateSongWithAI(prompt);
  });
}

document.getElementById('btn-play').addEventListener('click', startPlayback);
document.getElementById('btn-pause').addEventListener('click', pausePlayback);
document.getElementById('btn-stop').addEventListener('click', stopPlayback);

document.getElementById('tempo').addEventListener('input', (e) => {
  document.getElementById('bpm-display').innerText = e.target.value;
});
