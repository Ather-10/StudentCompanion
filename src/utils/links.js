import { Linking, Platform, Share } from 'react-native';
import { APP } from '../config/app';

export const storeUrl = `https://play.google.com/store/apps/details?id=${APP.packageId}`;

export const rateApp = () => {
  if (Platform.OS === 'android') {
    Linking.openURL(`market://details?id=${APP.packageId}`).catch(() => Linking.openURL(storeUrl).catch(() => {}));
  } else {
    Linking.openURL(storeUrl).catch(() => {});
  }
};

export const shareApp = () =>
  Share.share({ message: `Try ${APP.name} - CGPA calculator, timetable, exam countdown and focus timer in one app. ${storeUrl}` }).catch(() => {});

export const sendFeedback = () =>
  Linking.openURL(`mailto:${APP.supportEmail}?subject=${encodeURIComponent(APP.name + ' feedback')}`).catch(() => {});
