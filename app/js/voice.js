/* Talking to the coach instead of typing at it.

   Two directions, and they are separate features that happen to live in the
   same file: speaking a question in, and having the answer read back out.
   Both matter more here than they would in most apps, because the moments
   this thing is useful are the moments your hands are busy — standing at a
   hob, driving home, holding a shopping basket.

   A caveat worth knowing rather than hiding: browser speech recognition
   sends audio to the browser vendor's servers to be transcribed. On an
   iPhone that is Apple. Nothing about it goes through this app, and the
   coach only ever receives the text — but "speak into your phone" and "type
   into your phone" are not identical privacy propositions, and the UI says
   so once rather than pretending otherwise.

   Speaking answers back out is entirely on-device and sends nothing
   anywhere. */

const Recognition = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

export function canListen() { return !!Recognition; }
export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * One dictation turn.
 *
 * `continuous` is deliberately off. On iOS it is unreliable, and the
 * behaviour it gives you elsewhere — a mic that stays open until you
 * remember to close it — is worse anyway. Speak, pause, it stops, you read
 * what it heard before sending. Interim results are on so the words appear
 * as you say them, because a button that looks like it is doing nothing for
 * four seconds is a button people press again.
 */
export function listen({ onInterim, onFinal, onError, onEnd }) {
  if (!Recognition) { onError?.('This browser cannot do speech.'); return null; }

  let rec;
  try { rec = new Recognition(); }
  catch { onError?.('Speech could not start on this device.'); return null; }

  rec.lang = navigator.language || 'en-US';
  rec.continuous = false;
  rec.interimResults = true;
  rec.maxAlternatives = 1;

  let finalText = '';

  rec.onresult = e => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const chunk = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalText += chunk;
      else interim += chunk;
    }
    if (interim) onInterim?.(finalText + interim);
    else onInterim?.(finalText);
  };

  rec.onerror = e => {
    const map = {
      'not-allowed': 'Microphone access was refused. Allow it in your browser settings for this site.',
      'service-not-allowed': 'Microphone access was refused. Allow it in your browser settings for this site.',
      'no-speech': 'I did not hear anything. Try again, a bit closer.',
      'audio-capture': 'No microphone found.',
      'network': 'Speech needs a connection, and there is not one right now. Type it instead.',
      'aborted': null           // the user stopped it on purpose; not an error
    };
    const msg = map[e.error];
    if (msg) onError?.(msg);
    else if (msg !== null) onError?.('Speech stopped unexpectedly. Type it instead.');
  };

  rec.onend = () => { onFinal?.(finalText.trim()); onEnd?.(); };

  try { rec.start(); }
  catch { onError?.('Speech is already running.'); return null; }

  return {
    stop() { try { rec.stop(); } catch { /* already stopped */ } },
    abort() { try { rec.abort(); } catch { /* already stopped */ } }
  };
}

/* ── reading the answer back ───────────────────────────────────── */

/** Markdown and asterisks read aloud as noise, so strip them first. */
function speakable(text) {
  return String(text || '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/(^|\n)#{1,4}\s*/g, '$1')
    .replace(/(^|\n)[-*•]\s+/g, '$1')
    .replace(/`+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function speak(text, { onEnd } = {}) {
  if (!canSpeak()) return false;
  stopSpeaking();
  const u = new SpeechSynthesisUtterance(speakable(text));
  u.lang = navigator.language || 'en-US';
  u.rate = 0.98;              // a shade under default; this is being read to someone
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  try { window.speechSynthesis.speak(u); return true; }
  catch { return false; }
}

export function stopSpeaking() {
  try { window.speechSynthesis.cancel(); } catch { /* nothing playing */ }
}

export function isSpeaking() {
  try { return window.speechSynthesis.speaking; } catch { return false; }
}
