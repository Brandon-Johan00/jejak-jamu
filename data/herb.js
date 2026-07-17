
export const HERBS = [
  {
    id: 'jahe',
    name: 'Ginger',
    localName: 'Jahe',
    tags: ['cold', 'nausea', 'inflammation', 'circulation'],
    summary:
      'A warming rhizome used across Indonesia to relieve nausea, colds, and poor circulation.',
    benefits: [
      'Eases nausea and motion sickness',
      'Reduces inflammation and muscle soreness',
      'Warms the body and supports circulation',
      'Soothes sore throats and coughs',
    ],
    dosage: '1–3 g of fresh root per day, steeped as tea (about 3–5 thin slices in hot water).',
    cautions: 'High doses may irritate the stomach; use caution with blood thinners.',
    image: '🫚',
  },
  {
    id: 'kunyit',
    name: 'Turmeric',
    localName: 'Kunyit',
    tags: ['inflammation', 'digestion', 'liver', 'skin'],
    summary:
      'The base of "jamu kunyit asam," prized for its anti-inflammatory curcumin content.',
    benefits: [
      'Anti-inflammatory, supports joint comfort',
      'Aids digestion and liver function',
      'Traditionally used for skin health',
      'Supports menstrual comfort (jamu kunyit asam)',
    ],
    dosage: '1–3 g of root per day, or 1 thumb-sized piece boiled into tea/jamu.',
    cautions: 'May interact with blood thinners; avoid high doses if you have gallstones.',
    image: '🟠',
  },
  {
    id: 'kencur',
    name: 'Aromatic Ginger',
    localName: 'Kencur',
    tags: ['cough', 'fatigue', 'digestion', 'energy'],
    summary:
      'Base of "beras kencur," a sweet-spicy tonic traditionally used for energy and coughs.',
    benefits: [
      'Relieves cough and sore throat',
      'Traditionally used to boost stamina',
      'Supports digestion and reduces bloating',
    ],
    dosage: '1–2 small rhizomes (~5g) per day, typically blended into beras kencur.',
    cautions: 'Strong flavor — start with a small amount to check tolerance.',
    image: '🌱',
  },
  {
    id: 'temulawak',
    name: 'Javanese Turmeric',
    localName: 'Temulawak',
    tags: ['liver', 'digestion', 'appetite', 'inflammation'],
    summary:
      'A larger cousin of turmeric, traditionally used as a liver tonic and appetite booster.',
    benefits: [
      'Supports liver detoxification',
      'Stimulates appetite',
      'Anti-inflammatory properties',
    ],
    dosage: '2–4 g dried rhizome per day, boiled as tea.',
    cautions: 'Avoid on an empty stomach in large amounts — can be strong for digestion.',
    image: '🟡',
  },
  {
    id: 'sambiloto',
    name: "King of Bitters",
    localName: 'Sambiloto',
    tags: ['fever', 'immune', 'diabetes', 'infection'],
    summary:
      'A famously bitter herb used to manage fevers, infections, and support blood sugar control.',
    benefits: [
      'Traditionally used to reduce fever',
      'Supports immune response',
      'Used to help manage blood sugar levels',
    ],
    dosage: '1–2 g dried leaf per day as tea; very bitter, often combined with honey.',
    cautions: 'Not recommended during pregnancy; may lower blood sugar/pressure further if combined with medication.',
    image: '🍃',
  },
  {
    id: 'daun-sirih',
    name: 'Betel Leaf',
    localName: 'Daun Sirih',
    tags: ['antiseptic', 'oral health', 'wound'],
    summary:
      'A traditional antiseptic leaf used for oral hygiene and minor wound care.',
    benefits: [
      'Natural antiseptic properties',
      'Used in traditional oral hygiene rinses',
      'Traditionally applied to minor cuts',
    ],
    dosage: 'Steep 2–3 leaves in hot water as a mouth rinse or topical wash; not typically ingested in large amounts.',
    cautions: 'For topical/rinse use only in most traditional practice; avoid on broken skin without guidance.',
    image: '🌿',
  },
  {
    id: 'serai',
    name: 'Lemongrass',
    localName: 'Serai',
    tags: ['digestion', 'cold', 'relaxation', 'fever'],
    summary:
      'An aromatic grass used in teas to calm digestion and ease cold symptoms.',
    benefits: [
      'Soothes an upset stomach',
      'Traditionally used to reduce mild fever',
      'Calming, aromatic effect',
    ],
    dosage: '1–2 stalks, bruised and steeped in hot water, 1–2 times per day.',
    cautions: 'Generally very safe; mild diuretic effect in large amounts.',
    image: '🌾',
  },
];

export function findHerbByName(name) {
  const n = name.toLowerCase();
  return HERBS.find(
    (h) => h.name.toLowerCase() === n || h.localName.toLowerCase() === n
  );
}
