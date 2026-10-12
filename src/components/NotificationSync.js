import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTimetable } from '../context/TimetableContext';
import { useExams } from '../context/ExamsContext';
import { setupNotifications, syncPlanReminders } from '../utils/notifications';

// Invisible helper: keeps phone reminders in step with your classes, exams and settings.
export default function NotificationSync() {
  const { settings, loaded: settingsLoaded } = useSettings();
  const { classes, loaded: classesLoaded } = useTimetable();
  const { exams, loaded: examsLoaded } = useExams();

  useEffect(() => {
    if (!settingsLoaded || !classesLoaded || !examsLoaded) return; // wait for saved data
    if (settings.classReminders || settings.examReminders) {
      setupNotifications(settings.alarmTone).then(() => syncPlanReminders({ classes, exams, settings }));
    } else {
      syncPlanReminders({ settings });
    }
  }, [settingsLoaded, classesLoaded, examsLoaded, classes, exams, settings.classReminders, settings.examReminders, settings.leadMin, settings.examWhen, settings.alarmTone]);

  return null;
}
