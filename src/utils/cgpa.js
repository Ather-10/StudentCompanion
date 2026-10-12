export const GRADES = [
  { g: 'A+', p: 4.0 }, { g: 'A', p: 4.0 }, { g: 'A-', p: 3.67 },
  { g: 'B+', p: 3.33 }, { g: 'B', p: 3.0 }, { g: 'B-', p: 2.67 },
  { g: 'C+', p: 2.33 }, { g: 'C', p: 2.0 }, { g: 'C-', p: 1.67 },
  { g: 'D+', p: 1.33 }, { g: 'D', p: 1.0 }, { g: 'F', p: 0 },
];

const POINTS = Object.fromEntries(GRADES.map((x) => [x.g, x.p]));

let idCounter = 0;
const uid = () => 'id' + ++idCounter;

export const newCourse = () => ({ id: uid(), name: '', credits: '3', grade: null, marks: '' });
export const newSemester = () => ({ id: uid(), courses: [newCourse(), newCourse(), newCourse()] });

// Weighted average of grade points (or marks) by credits.
export function calc(courses, scale) {
  let pts = 0;
  let cr = 0;
  courses.forEach((c) => {
    const credit = parseFloat(c.credits);
    const val = scale === '4.0' ? POINTS[c.grade] : Math.min(100, parseFloat(c.marks));
    if (credit > 0 && val !== undefined && !isNaN(val)) {
      pts += val * credit;
      cr += credit;
    }
  });
  return { value: cr ? pts / cr : null, credits: cr };
}

export const fmt = (v, scale) => (v === null ? '–' : scale === '4.0' ? v.toFixed(2) : v.toFixed(1) + '%');
