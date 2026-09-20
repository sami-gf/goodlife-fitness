# Goodlife Fitness — Customization & Architecture Handbook

This repository contains the complete fullstack application and CRM for Goodlife Fitness (Ghattekulo, Kathmandu 44600).

## Quick Cheat Sheet: How to Change Things

| What to Change | File Location | Line Numbers |
| :--- | :--- | :--- |
| **Gym Name / Logo** | `src/components/layout/FooterLogo.jsx` | Lines 13–17 |
| **Phone Number / WhatsApp** | `src/components/WhatsAppButton.jsx`<br/>`src/components/layout/Footer.jsx` | Line 4 (`WhatsAppButton.jsx`)<br/>Line 104 (`Footer.jsx`) |
| **Email Address** | `src/components/layout/Footer.jsx`<br/>`src/pages/Contact.jsx` | Line 111 (`Footer.jsx`)<br/>Line 125 (`Contact.jsx`) |
| **Address & Postal Code** | `src/components/layout/Footer.jsx`<br/>`src/components/layout/Header.jsx` | Line 98 (`Footer.jsx`)<br/>Line 50 (`Header.jsx`) |
| **Membership Prices (NPR)** | `src/base44/entities/Membership.js` | Lines 8–80 |
| **Class Schedule & Timings** | `src/base44/entities/StudioClass.js` | Lines 6–180 |
| **Trainers & Coach Bios** | `src/base44/entities/Instructor.js` | Lines 6–80 |
| **Hero Animated Headline** | `src/components/home/HeroSection.jsx` | Lines 8–13 |
| **Admin CRM Login PIN (1234)**| `src/pages/AdminDashboard.jsx` | Line 213 |
| **Theme Colors & Background** | `src/index.css` | Lines 10–22 |
| **Database Connection String**| `.env` | Line 1 (`MONGODB_URI`) |

## Running the App
- `npm run dev:all` — Start frontend (`:5173`) and backend (`:5001`) with hot reload.
- `npm start` — Run production unified server (`:5001`).
- `npm run build` — Build production bundle to `dist/`.
