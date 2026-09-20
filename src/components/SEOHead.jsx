import { useEffect } from 'react';

export default function SEOHead({ title, description }) {
  useEffect(() => {
    // Update Page Title
    const fullTitle = title 
      ? `${title} | Goodlife Fitness Ghattekulo, Kathmandu` 
      : "Goodlife Fitness — Premier 24/7 Gym & Athletic Club | Ghattekulo, Kathmandu (44600)";
    document.title = fullTitle;

    // Update Meta Description
    const defaultDesc = "Goodlife Fitness in Ghattekulo, Kathmandu (Postal Code 44600). 24/7 gym access, heavy iron pits, luxury thermal saunas, and certified trainers. NPR memberships & live class bookings. Call 9800548346.";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description || defaultDesc);
    }

    // Scroll to top on page navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title, description]);

  return null;
}
