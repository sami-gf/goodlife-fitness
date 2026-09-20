/**
 * Membership Entity & Mock Dataset (Goodlife Fitness)
 * All pricing is formatted in NPR (Nepalese Rupees)
 */

export const INITIAL_MEMBERSHIPS = [
  {
    id: 'day-pass',
    name: 'Day Pass',
    category: 'pass',
    tagline: 'Flexible Single Access',
    priceMonthlyNPR: 1200,
    priceAnnualNPR: 1200,
    popular: false,
    badge: 'Popular for Travelers',
    features: [
      'Full Gym & Cardio Floor Access (1 Day)',
      'Locker & Sauna Access',
      'Free Protein Shake sample',
      'Standard WiFi access'
    ],
    ctaText: 'Get Day Pass',
    accentColor: 'border-slate-700'
  },
  {
    id: 'basic-fit',
    name: 'Basic Fit',
    category: 'membership',
    tagline: 'Essential Gym Access',
    priceMonthlyNPR: 2500,
    priceAnnualNPR: 2000, // 20% discount on annual
    popular: false,
    badge: 'Starter Friendly',
    features: [
      'Full Gym & Free Weights Access',
      'Locker Room & Shower Access',
      'Fitness Assessment on Join',
      'Goodlife Mobile App Access',
      'Peak Hour Access (6 AM - 9 PM)'
    ],
    ctaText: 'Choose Basic',
    accentColor: 'border-slate-700'
  },
  {
    id: 'pro-standard',
    name: 'Pro Standard',
    category: 'membership',
    tagline: 'Most Popular Membership',
    priceMonthlyNPR: 4800,
    priceAnnualNPR: 3840,
    popular: true,
    badge: 'Best Value',
    features: [
      '24/7 Unlimited Gym Access across all locations',
      'Unlimited Studio Classes (HIIT, Yoga, Boxing, Spin)',
      'Steam Room & Thermal Sauna Access',
      '2 Free Personal Trainer sessions per month',
      'Guest Pass (1 Guest per month)',
      'Customized Workout & Nutrition Plan'
    ],
    ctaText: 'Join Pro Standard',
    accentColor: 'border-emerald-500'
  },
  {
    id: 'vip-elite',
    name: 'VIP Platinum',
    category: 'membership',
    tagline: 'Ultimate All-Inclusive VIP',
    priceMonthlyNPR: 8500,
    priceAnnualNPR: 6800,
    popular: false,
    badge: 'VIP Concierge',
    features: [
      '24/7 Unlimited VIP Access (All Branches)',
      'Unlimited Classes + Priority Slot Reservation',
      '4 Dedicated Personal Trainer Sessions / month',
      'Unlimited Sauna & Recovery Spa Access',
      'Free Daily Post-Workout Smoothie at Bar',
      'Dedicated VIP Locker & Laundry Service',
      'Unlimited Guest Passes'
    ],
    ctaText: 'Get VIP Platinum',
    accentColor: 'border-amber-500'
  }
];

export const ADD_ONS = [
  { id: 'pt-addon', name: 'Personal Trainer (4 Sessions/mo)', priceNPR: 3500 },
  { id: 'nutrition-addon', name: 'Customized Nutrition Plan', priceNPR: 1500 },
  { id: 'sauna-addon', name: 'Sauna & Spa Access Pass', priceNPR: 1200 },
  { id: 'towel-addon', name: 'Premium Towel & Locker Service', priceNPR: 800 }
];

export class Membership {
  static getAll() {
    return INITIAL_MEMBERSHIPS;
  }

  static getById(id) {
    return INITIAL_MEMBERSHIPS.find(m => m.id === id);
  }

  static formatNPR(amount) {
    return `NPR ${amount.toLocaleString('en-NP')}`;
  }
}
