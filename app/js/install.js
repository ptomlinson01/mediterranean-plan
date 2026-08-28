/* Getting the app onto the phone.

   This exists because the same question came up twice, and the second time
   with "it seemed confusing" attached. The instructions were written down —
   in a README, on GitHub, which is the one place someone holding a phone is
   never looking.

   The awkward part is that iOS has no install prompt. There is no button a
   page can offer; the user has to find Share and then Add to Home Screen,
   and only in Safari — Chrome on iOS cannot do it at all, and fails
   silently rather than saying so. So the honest thing is to work out which
   browser they are actually in and tell them the truth for that one. */

export function isInstalled() {
  try {
    return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
  } catch {
    return false;
  }
}

export function platform() {
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua)
    // iPadOS 13+ reports itself as a Mac; the touch points give it away.
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (iOS) {
    // On iOS every browser is Safari underneath, so sniffing the engine is
    // useless — the branded wrappers are what cannot install.
    if (/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)) return 'ios-other';
    return 'ios-safari';
  }
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

/* Android and desktop Chrome fire this instead of installing directly, and
   only once — so it is caught at load and held for whenever the user
   actually asks. */
let deferredPrompt = null;
try {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
  });
} catch { /* not a browser that does this */ }

export function canPrompt() { return !!deferredPrompt; }

export async function promptInstall() {
  if (!deferredPrompt) return 'unavailable';
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;             // it is single-use
  return outcome;                    // 'accepted' | 'dismissed'
}

/** What to actually tell this person, on this device, right now. */
export function installGuide() {
  if (isInstalled()) {
    return {
      done: true,
      title: 'It is installed',
      steps: [],
      note: 'You are running it from the home screen, which is where it works best — full screen, and it opens without a signal.'
    };
  }

  switch (platform()) {
    case 'ios-safari':
      return {
        done: false,
        title: 'Put it on your home screen',
        steps: [
          'Tap the Share button — the square with an arrow coming out of the top. It is at the bottom of the screen in Safari, or the top right on an iPad.',
          'Scroll down the list of options. It is further down than you expect.',
          'Tap "Add to Home Screen".',
          'Tap "Add", top right.'
        ],
        note: 'It then behaves like a normal app: its own icon, full screen, no address bar, and it opens with no signal. This is the only way onto an iPhone — Apple does not allow an install button.'
      };

    case 'ios-other':
      return {
        done: false,
        title: 'You need Safari for this bit',
        steps: [
          'Copy this page\'s address.',
          'Open Safari and paste it in.',
          'Then use Share → Add to Home Screen.'
        ],
        note: 'You are in Chrome, Firefox or Edge. On an iPhone none of them can add an app to the home screen — Apple only allows Safari to do it, and the others give you no message saying so. Nothing is wrong with your phone.'
      };

    case 'android':
      return {
        done: false,
        title: 'Add it to your home screen',
        steps: [
          'Tap the three dots, top right.',
          'Tap "Install app" or "Add to Home screen".',
          'Confirm.'
        ],
        note: 'Then it opens like any other app.'
      };

    default:
      return {
        done: false,
        title: 'Install it',
        steps: [
          'Look for an install icon at the right-hand end of the address bar.',
          'Or open the browser menu and choose "Install".'
        ],
        note: 'This app is built for a phone. On a computer it works, but the layout is made for a screen you hold in one hand.'
      };
  }
}
