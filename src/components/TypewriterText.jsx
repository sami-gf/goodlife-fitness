import React, { useState, useEffect } from 'react';

export default function TypewriterText({ 
  words = [
    "UNLEASH YOUR POTENTIAL",
    "REDEFINE YOUR LIMITS",
    "TRANSFORM YOUR LIFE",
    "DOMINATE EVERY GOAL"
  ], 
  delay = 2500, 
  speed = 70 
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState(words[0] ? words[0].substring(0, 1) : '');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const fullWord = words[currentWordIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing forward
        const nextText = fullWord.substring(0, currentText.length + 1);
        setCurrentText(nextText);
        if (nextText === fullWord) {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        // Deleting
        const nextText = fullWord.substring(0, currentText.length - 1);
        setCurrentText(nextText);
        if (nextText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, delay, speed]);

  return (
    <span className="inline-flex items-center flex-wrap gap-x-1.5 align-middle">
      <span className="text-gradient-emerald font-black tracking-tight drop-shadow-[0_2px_15px_rgba(16,185,129,0.3)]">
        {currentText || '\u00A0'}
      </span>
      <span className="inline-block w-[3px] h-8 sm:h-10 bg-emerald-400 animate-pulse rounded-full shadow-[0_0_10px_#10b981]" />
    </span>
  );
}
