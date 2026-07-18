/**
 * Sample data for the Insights dashboard and Flavor Quiz.
 * Numbers are made-up demo values for a portfolio project — not real Dr Pepper sales data.
 */

export type ProductId = 'original' | 'cherry' | 'cream-soda' | 'zero-sugar';

export const FLAVOR_SHARE = [
  { id: 'original' as ProductId, name: 'Original', percent: 42, color: '#711F25' },
  { id: 'cherry' as ProductId, name: 'Cherry', percent: 23, color: '#9E1B32' },
  { id: 'cream-soda' as ProductId, name: 'Cream Soda', percent: 18, color: '#D4AF37' },
  { id: 'zero-sugar' as ProductId, name: 'Zero Sugar', percent: 17, color: '#1A1A1A' },
];

export const REGION_STATS = [
  { region: 'Southwest', favorite: 'Original', score: 91 },
  { region: 'Southeast', favorite: 'Cherry', score: 84 },
  { region: 'Midwest', favorite: 'Original', score: 79 },
  { region: 'West Coast', favorite: 'Zero Sugar', score: 76 },
  { region: 'Northeast', favorite: 'Cream Soda', score: 72 },
];

export const HIGHLIGHTS = [
  { label: 'Survey responses', value: '1,200' },
  { label: 'Avg. rating (1–5)', value: '4.6' },
  { label: 'Would buy again', value: '81%' },
];

/** Each answer adds points to one or more products. Highest score wins. */
export const QUIZ_QUESTIONS = [
  {
    id: 'vibe',
    prompt: 'What are you in the mood for?',
    options: [
      { label: 'Classic and familiar', scores: { original: 3, cherry: 0, 'cream-soda': 0, 'zero-sugar': 1 } },
      { label: 'Something fruity', scores: { original: 0, cherry: 3, 'cream-soda': 1, 'zero-sugar': 0 } },
      { label: 'Smooth and creamy', scores: { original: 0, cherry: 1, 'cream-soda': 3, 'zero-sugar': 0 } },
      { label: 'Bold with less sugar', scores: { original: 1, cherry: 0, 'cream-soda': 0, 'zero-sugar': 3 } },
    ],
  },
  {
    id: 'time',
    prompt: 'When do you usually grab a soda?',
    options: [
      { label: 'With a meal', scores: { original: 3, cherry: 1, 'cream-soda': 1, 'zero-sugar': 1 } },
      { label: 'As a dessert drink', scores: { original: 0, cherry: 2, 'cream-soda': 3, 'zero-sugar': 0 } },
      { label: 'During studying / work', scores: { original: 1, cherry: 0, 'cream-soda': 0, 'zero-sugar': 3 } },
      { label: 'At a party', scores: { original: 2, cherry: 3, 'cream-soda': 1, 'zero-sugar': 1 } },
    ],
  },
  {
    id: 'sweet',
    prompt: 'How sweet do you like it?',
    options: [
      { label: 'Very sweet', scores: { original: 1, cherry: 2, 'cream-soda': 3, 'zero-sugar': 0 } },
      { label: 'Balanced', scores: { original: 3, cherry: 2, 'cream-soda': 1, 'zero-sugar': 1 } },
      { label: 'Light / low sugar', scores: { original: 0, cherry: 0, 'cream-soda': 0, 'zero-sugar': 3 } },
    ],
  },
];

export const QUIZ_RESULTS: Record<
  ProductId,
  { name: string; blurb: string; color: string }
> = {
  original: {
    name: 'Dr Pepper Original',
    blurb: 'You want the classic 23-flavor blend — bold, familiar, and hard to categorize.',
    color: '#711F25',
  },
  cherry: {
    name: 'Dr Pepper Cherry',
    blurb: 'A fruity twist on the classic hits the spot for your taste.',
    color: '#9E1B32',
  },
  'cream-soda': {
    name: 'Dr Pepper & Cream Soda',
    blurb: 'Smooth and rich is your lane — cream soda meets the 23 flavors.',
    color: '#D4AF37',
  },
  'zero-sugar': {
    name: 'Dr Pepper Zero Sugar',
    blurb: 'You want the bold taste without the sugar. Zero Sugar is built for that.',
    color: '#1A1A1A',
  },
};
