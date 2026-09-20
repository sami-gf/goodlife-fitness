/**
 * User Entity & Local Storage State (Goodlife Fitness)
 */

const USER_STORAGE_KEY = 'goodlife_current_user';

export class User {
  static getProfile() {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        name: 'Suman Shrestha',
        email: 'suman.shrestha@example.com',
        phone: '+977 9841234567',
        membershipPlan: 'Pro Standard',
        membershipStatus: 'Active',
        validUntil: '2027-01-15',
        rewardPoints: 480,
        preferredLocation: 'Kathmandu Central'
      };
    } catch {
      return {
        name: 'Suman Shrestha',
        email: 'suman.shrestha@example.com',
        phone: '+977 9841234567',
        membershipPlan: 'Pro Standard',
        membershipStatus: 'Active',
        validUntil: '2027-01-15',
        rewardPoints: 480,
        preferredLocation: 'Kathmandu Central'
      };
    }
  }

  static updateProfile(updatedFields) {
    const current = this.getProfile();
    const updated = { ...current, ...updatedFields };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
}
