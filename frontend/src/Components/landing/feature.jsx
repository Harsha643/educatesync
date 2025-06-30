import React from 'react';
import "./feature.css"

const features = [
  {
    icon: '📚',
    title: 'Course Management',
    description: 'Easily manage all your subjects, notes, and materials in one place.',
  },
  {
    icon: '📅',
    title: 'Smart Scheduling',
    description: 'Plan your week with smart calendars and get study reminders instantly.',
  },
  {
    icon: '🔔',
    title: 'Reminders & Notifications',
    description: 'Stay on track with alerts for deadlines, exams, and assignments.',
  },
];

const Features = () => {
  return (
    <section className="features-section">
      <h2 className="features-title">Smart Features Built for Students</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

