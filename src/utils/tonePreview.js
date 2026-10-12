import { createAudioPlayer } from 'expo-audio';

let player = null;
let timer = null;

export function stopPreview() {
  clearTimeout(timer);
  if (player) {
    try {
      player.pause();
      if (player.remove) player.remove();
    } catch (e) {
      // nothing to stop
    }
    player = null;
  }
}

// Plays the first few seconds of a tone so you can hear it before choosing.
export function previewTone(tone) {
  stopPreview();
  try {
    player = createAudioPlayer(tone.asset);
    player.play();
    timer = setTimeout(stopPreview, 4000);
  } catch (e) {
    player = null;
  }
}
