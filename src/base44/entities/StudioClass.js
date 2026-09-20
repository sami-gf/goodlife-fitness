/**
 * StudioClass Entity & Dataset (Goodlife Fitness)
 */

export const INITIAL_CLASSES = [
  {
    id: 'class-1',
    title: 'HIIT Surge 45',
    category: 'HIIT',
    instructorId: 'inst-1',
    instructorName: 'Aarav Sharma',
    day: 'Monday',
    time: '07:00 AM - 07:45 AM',
    timeOfDay: 'morning',
    room: 'Studio Alpha',
    intensity: 'High',
    caloriesBurned: '550 - 700 kcal',
    capacity: 20,
    bookedCount: 16,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    description: 'High-intensity interval training designed to push aerobic limits, spike metabolic rate, and torch calories with bodyweight & kettlebell circuits.'
  },
  {
    id: 'class-2',
    title: 'Power Sunrise Yoga',
    category: 'Yoga',
    instructorId: 'inst-2',
    instructorName: 'Maya Gurung',
    day: 'Monday',
    time: '08:00 AM - 09:00 AM',
    timeOfDay: 'morning',
    room: 'Zen Sanctuary',
    intensity: 'Moderate',
    caloriesBurned: '300 - 400 kcal',
    capacity: 15,
    bookedCount: 12,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop',
    description: 'Dynamic vinyasa flow connecting breath with continuous strength postures to boost flexibility, balance, and mental clarity for the week.'
  },
  {
    id: 'class-3',
    title: 'Iron Pit: Heavy Lifting',
    category: 'Strength',
    instructorId: 'inst-1',
    instructorName: 'Aarav Sharma',
    day: 'Monday',
    time: '05:30 PM - 06:30 PM',
    timeOfDay: 'evening',
    room: 'Heavy Weight Zone',
    intensity: 'High',
    caloriesBurned: '450 - 600 kcal',
    capacity: 12,
    bookedCount: 11,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    description: 'Compound lifting fundamentals (Squat, Bench, Deadlift, Press) with progressive overload Coaching and technique refinement.'
  },
  {
    id: 'class-4',
    title: 'Knockout Boxing Club',
    category: 'Boxing',
    instructorId: 'inst-3',
    instructorName: 'Rohan Thapa',
    day: 'Tuesday',
    time: '06:30 AM - 07:30 AM',
    timeOfDay: 'morning',
    room: 'Combat Ring',
    intensity: 'High',
    caloriesBurned: '600 - 800 kcal',
    capacity: 16,
    bookedCount: 13,
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=800&auto=format&fit=crop',
    description: 'Heavy bag drills, pad work combinations, core conditioning, and fighter cardio for upper body conditioning and stress release.'
  },
  {
    id: 'class-5',
    title: 'Rhythm Spin Burn',
    category: 'Spin',
    instructorId: 'inst-4',
    instructorName: 'Sujata Shrestha',
    day: 'Tuesday',
    time: '06:00 PM - 06:45 PM',
    timeOfDay: 'evening',
    room: 'Cycle Arena',
    intensity: 'High',
    caloriesBurned: '500 - 750 kcal',
    capacity: 24,
    bookedCount: 22,
    image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=800&auto=format&fit=crop',
    description: 'Immersive indoor cycling setup with high-beat music, sprint intervals, incline climbs, and upper body dumbbell pumps.'
  },
  {
    id: 'class-6',
    title: 'CrossFit WOD Matrix',
    category: 'CrossFit',
    instructorId: 'inst-5',
    instructorName: 'Kiran Adhikari',
    day: 'Wednesday',
    time: '07:00 AM - 08:00 AM',
    timeOfDay: 'morning',
    room: 'Rig Arena',
    intensity: 'Advanced',
    caloriesBurned: '600 - 850 kcal',
    capacity: 14,
    bookedCount: 14, // Full spot demonstration
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    description: 'Workout of the Day featuring Olympic cleans, gymnastic pull-ups, rowers, and high work capacity intervals.'
  },
  {
    id: 'class-7',
    title: 'Core & Sculpt Pilates',
    category: 'Pilates',
    instructorId: 'inst-2',
    instructorName: 'Maya Gurung',
    day: 'Wednesday',
    time: '05:00 PM - 05:50 PM',
    timeOfDay: 'evening',
    room: 'Zen Sanctuary',
    intensity: 'Low',
    caloriesBurned: '250 - 350 kcal',
    capacity: 18,
    bookedCount: 10,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
    description: 'Targeted mat pilates focusing on deep abdominal engagement, posture alignment, glute isolation, and spinal mobility.'
  },
  {
    id: 'class-8',
    title: 'Full-Body HIIT Blast',
    category: 'HIIT',
    instructorId: 'inst-1',
    instructorName: 'Aarav Sharma',
    day: 'Thursday',
    time: '06:00 AM - 06:45 AM',
    timeOfDay: 'morning',
    room: 'Studio Alpha',
    intensity: 'High',
    caloriesBurned: '500 - 700 kcal',
    capacity: 20,
    bookedCount: 15,
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop',
    description: 'Tabata style intervals mixing battle ropes, plyometric box jumps, and sled pushes for peak athletic output.'
  },
  {
    id: 'class-9',
    title: 'Sunset Restorative Flow',
    category: 'Yoga',
    instructorId: 'inst-2',
    instructorName: 'Maya Gurung',
    day: 'Friday',
    time: '06:30 PM - 07:30 PM',
    timeOfDay: 'evening',
    room: 'Zen Sanctuary',
    intensity: 'Low',
    caloriesBurned: '200 - 300 kcal',
    capacity: 20,
    bookedCount: 9,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    description: 'Deep stretch yin postures, joint mobility work, and guided meditation to unwind after a heavy training week.'
  },
  {
    id: 'class-10',
    title: 'Weekend Warrior Shred',
    category: 'HIIT',
    instructorId: 'inst-3',
    instructorName: 'Rohan Thapa',
    day: 'Saturday',
    time: '09:00 AM - 10:15 AM',
    timeOfDay: 'morning',
    room: 'Main Rig',
    intensity: 'Advanced',
    caloriesBurned: '700 - 900 kcal',
    capacity: 25,
    bookedCount: 19,
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop',
    description: 'Extended 75-minute weekend team challenge incorporating obstacles, tire flips, sandbag carries, and energetic music.'
  }
];

export class StudioClass {
  static getAll() {
    return INITIAL_CLASSES;
  }

  static getById(id) {
    return INITIAL_CLASSES.find(c => c.id === id);
  }
}
