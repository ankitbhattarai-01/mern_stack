// The example products drawn on the landing page shelf. These are not real
// products from the database.
//
// Each drawing has its origin at the bottom centre, so y values go up as
// negative numbers. "shapes" are coloured and outlined, "lines" are outline
// only, and "spoil" only appears once the product has expired.

const dot = (x, y, r) =>
  `M${x - r} ${y} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`

export const STINK_LINES = [
  'M-16 -156 q-7 -7 0 -14 q7 -7 0 -14',
  'M12 -160 q-7 -7 0 -14 q7 -7 0 -14',
]

export const SHELF_ITEMS = [
  {
    id: 'milk',
    name: 'Fresh milk',
    daysLeft: 2,
    text: { value: 'MILK', y: -66, size: 22 },
    shapes: [
      { d: 'M-40 0 V-108 H40 V0 Z', fill: '#fbf7ec' },
      { d: 'M-40 -30 Q-20 -50 0 -34 T40 -36 V0 H-40 Z', fill: '#4f9cc9' },
      { d: 'M-40 -108 L-28 -134 H28 L40 -108 Z', fill: '#4f9cc9' },
      { d: 'M-28 -134 V-146 H28 V-134 Z', fill: '#fbf7ec' },
    ],
    lines: ['M0 -134 L-10 -108', 'M0 -134 L10 -108'],
    spoil: [],
    stink: true,
  },
  {
    id: 'dahi',
    name: 'Dahi',
    daysLeft: 5,
    text: { value: 'DAHI', y: -38, size: 22, fill: '#fbf7ec' },
    shapes: [
      { d: 'M-50 -82 Q-60 -38 -30 0 H30 Q60 -38 50 -82 Z', fill: '#c8693a' },
      { d: 'M-46 -94 Q0 -126 46 -94 Z', fill: '#f4e2b8' },
      { d: 'M-54 -94 H54 V-82 H-54 Z', fill: '#dd8a58' },
    ],
    lines: ['M-24 -100 L-28 -94', 'M0 -108 V-94', 'M24 -100 L28 -94'],
    spoil: [],
    stink: true,
  },
  {
    id: 'bread',
    name: 'Sliced bread',
    daysLeft: 12,
    shapes: [
      {
        d: 'M-60 0 V-58 Q-74 -72 -60 -88 Q-40 -104 0 -102 Q40 -104 60 -88 Q74 -72 60 -58 V0 Z',
        fill: '#dca65a',
      },
      {
        d: 'M-60 0 V-58 Q-74 -72 -60 -88 Q-46 -100 -30 -88 Q-16 -72 -30 -58 V0 Z',
        fill: '#f6e3b6',
      },
    ],
    lines: ['M-6 -101 Q8 -76 -4 -58 V0', 'M20 -101 Q34 -76 22 -58 V0'],
    spoil: [
      { d: dot(-44, -66, 8), fill: '#5c8a4a' },
      { d: dot(-40, -36, 5), fill: '#5c8a4a' },
      { d: dot(8, -78, 7), fill: '#5c8a4a' },
      { d: dot(38, -46, 10), fill: '#5c8a4a' },
      { d: dot(42, -82, 4), fill: '#5c8a4a' },
    ],
  },
  {
    id: 'juice',
    name: 'Orange juice',
    daysLeft: 9,
    text: { value: 'JUICE', y: -42, size: 18 },
    shapes: [
      {
        d: 'M-12 -146 V-118 Q-36 -106 -36 -82 V-8 Q-36 0 -28 0 H28 Q36 0 36 -8 V-82 Q36 -106 12 -118 V-146 Z',
        fill: '#f08a24',
      },
      { d: 'M-15 -158 H15 V-146 H-15 Z', fill: '#2f7a4f' },
      { d: 'M-36 -68 H36 V-22 H-36 Z', fill: '#fbf7ec' },
    ],
    lines: ['M-24 -92 V-80'],
    spoil: [],
  },
  {
    id: 'paracetamol',
    name: 'Paracetamol',
    daysLeft: 34,
    text: { value: '500mg', y: -42, size: 18 },
    shapes: [
      { d: 'M-36 -92 V-6 Q-36 0 -30 0 H30 Q36 0 36 -6 V-92 Z', fill: '#b3591c' },
      { d: 'M-36 -68 H36 V-22 H-36 Z', fill: '#fbf7ec' },
      { d: 'M-40 -124 H40 V-92 H-40 Z', fill: '#fbf7ec' },
    ],
    lines: ['M-24 -124 V-92', 'M-8 -124 V-92', 'M8 -124 V-92', 'M24 -124 V-92'],
    spoil: [],
  },
  {
    id: 'sunscreen',
    name: 'Sunscreen',
    daysLeft: 22,
    text: { value: 'SPF50', y: -56, size: 14 },
    shapes: [
      { d: 'M-38 -148 H38 L24 -34 H-24 Z', fill: '#f7c948' },
      { d: 'M-40 -158 H40 V-148 H-40 Z', fill: '#f7c948' },
      { d: 'M-24 -34 H24 V0 H-24 Z', fill: '#17557a' },
      { d: dot(0, -104, 16), fill: '#f08a24' },
    ],
    lines: [],
    spoil: [],
  },
  {
    id: 'tea',
    name: 'Green tea',
    daysLeft: 150,
    text: { value: 'TEA', y: -22, size: 20, fill: '#fbf7ec' },
    shapes: [
      { d: 'M-38 0 V-112 H38 V0 Z', fill: '#2f7a4f' },
      { d: 'M-42 -134 H42 V-112 H-42 Z', fill: '#c9a227' },
      { d: 'M-16 -48 Q-14 -92 18 -92 Q20 -50 -16 -48 Z', fill: '#bfe3b4' },
    ],
    lines: ['M-16 -48 L8 -76'],
    spoil: [],
  },
  {
    id: 'soap',
    name: 'Dish soap',
    daysLeft: 400,
    text: { value: 'SOAP', y: -44, size: 19, fill: '#17212e' },
    shapes: [
      {
        d: 'M-34 -6 Q-34 0 -28 0 H28 Q34 0 34 -6 V-88 Q34 -108 16 -112 H-16 Q-34 -108 -34 -88 Z',
        fill: '#7fd0c3',
      },
      { d: 'M-10 -128 H10 V-112 H-10 Z', fill: '#fbf7ec' },
      { d: 'M-6 -128 V-142 H-36 V-152 H12 V-128 Z', fill: '#fbf7ec' },
    ],
    lines: [],
    spoil: [],
  },
]
