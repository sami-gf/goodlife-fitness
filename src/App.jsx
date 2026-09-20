import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ClassSchedule from './pages/ClassSchedule';
import Facilities from './pages/Facilities';
import Pricing from './pages/Pricing';
import Instructors from './pages/Instructors';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Accessibility from './pages/Accessibility';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/classes"
          element={
            <Layout>
              <ClassSchedule />
            </Layout>
          }
        />
        <Route
          path="/schedule"
          element={
            <Layout>
              <ClassSchedule />
            </Layout>
          }
        />
        <Route
          path="/facilities"
          element={
            <Layout>
              <Facilities />
            </Layout>
          }
        />
        <Route
          path="/pricing"
          element={
            <Layout>
              <Pricing />
            </Layout>
          }
        />
        <Route
          path="/instructors"
          element={
            <Layout>
              <Instructors />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout>
              <PrivacyPolicy />
            </Layout>
          }
        />
        <Route
          path="/terms"
          element={
            <Layout>
              <Terms />
            </Layout>
          }
        />
        <Route
          path="/accessibility"
          element={
            <Layout>
              <Accessibility />
            </Layout>
          }
        />
        {/* Commercial Gym Owner Admin CRM Portal */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 404 - catches all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
