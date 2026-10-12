import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

// Shrinks the picked picture to a small square so it is quick to save and load.
async function shrink(uri) {
  const options = { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true };
  try {
    const ctx = ImageManipulator.ImageManipulator.manipulate(uri);
    ctx.resize({ width: 320 });
    const image = await ctx.renderAsync();
    return (await image.saveAsync(options)).base64;
  } catch (e) {
    // older Expo versions
    return (await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 320 } }], options)).base64;
  }
}

// source: 'library' | 'camera'
// Returns { photo } on success, { cancelled: true }, or { error: 'camera-denied' | 'failed' }
export async function pickProfilePhoto(source) {
  try {
    if (source === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return { error: 'camera-denied' };
    }
    const options = { mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 };
    const res = source === 'camera' ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    if (res.canceled || !res.assets || !res.assets[0]) return { cancelled: true };
    const base64 = await shrink(res.assets[0].uri);
    return { photo: 'data:image/jpeg;base64,' + base64 };
  } catch (e) {
    return { error: 'failed' };
  }
}
