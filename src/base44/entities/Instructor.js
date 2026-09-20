/**
 * Instructor Entity & Dataset (Goodlife Fitness)
 */

export const INITIAL_INSTRUCTORS = [
  {
    id: 'inst-1',
    name: 'Aarav Sharma',
    role: 'Head Strength & Conditioning Coach',
    specialties: ['HIIT', 'Strength & Power', 'Powerlifting'],
    experience: '8+ Years',
    bio: 'Former national powerlifter and certified CSCS trainer dedicated to pushing human potential to absolute limits with scientific movement mechanics.',
    photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 142,
    instagram: '@aarav.lifts',
    quote: 'Discipline is doing what needs to be done, even when you do not feel like it.'
  },
  {
    id: 'inst-2',
    name: 'Maya Gurung',
    role: 'Master Yoga & Pilates Specialist',
    specialties: ['Power Yoga', 'Core Pilates', 'Mindfulness'],
    experience: '6+ Years',
    bio: 'Certified 500-hr RYT Yoga teacher specializing in bio-mechanical alignment, core stability, and stress relief through breathing mastery.',
    photo: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
    reviewsCount: 189,
    instagram: '@maya.flow',
    quote: 'Flexibility of body creates adaptability of mind.'
  },
  {
    id: 'inst-3',
    name: 'Rohan Thapa',
    role: 'Boxing & Tactical Conditioning Master',
    specialties: ['Boxing Club', 'Combat HIIT', 'Speed & Agility'],
    experience: '10+ Years',
    bio: 'Ex-amateur boxing champion bringing high-octane heavy bag workouts, sharp footwork drills, and explosive fat-burning routines.',
    photo: 'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=800&auto=format&fit=crop',
    rating: 4.85,
    reviewsCount: 116,
    instagram: '@rohan_fightfit',
    quote: 'Every round is a new opportunity to outshine who you were yesterday.'
  },
  {
    id: 'inst-4',
    name: 'Sujata Shrestha',
    role: 'Spin Burn & Rhythm Cycling Lead',
    specialties: ['Spin Burn', 'Cardio Endurance', 'Zumba'],
    experience: '5+ Years',
    bio: 'Energy unmatched! Sujata brings concert-like spin sessions with pounding beats, high calorie burns, and relentless motivation.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    rating: 4.95,
    reviewsCount: 204,
    instagram: '@sujata_spin',
    quote: 'Ride to the rhythm, burn past your doubts.'
  },
  {
    id: 'inst-5',
    name: 'Kiran Adhikari',
    role: 'CrossFit Matrix Coach',
    specialties: ['CrossFit Matrix', 'Functional Fitness', 'Kettlebell'],
    experience: '7+ Years',
    bio: 'Level 2 CrossFit Trainer focused on functional endurance, Olympic lifting safety, and fostering an unbreakable community vibe.',
    photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 98,
    instagram: '@kiran.crossfit',
    quote: 'Stronger together than anyone alone.'
  }
];

export class Instructor {
  static getAll() {
    return INITIAL_INSTRUCTORS;
  }

  static getById(id) {
    return INITIAL_INSTRUCTORS.find(inst => inst.id === id);
  }
}
