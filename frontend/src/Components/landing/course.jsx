import React from 'react';
import './course.css'; // Make sure this file matches

const courses = [
  {
    emoji: '🧠',
    title: 'Study Smarter',
    description: 'Learn hacks, memory tricks, and time-saving techniques to boost your grades.',
  },
  {
    emoji: '💰',
    title: 'Money Skills',
    description: 'Understand saving, spending, and building healthy money habits early.',
  },
  {
    emoji: '🤖',
    title: 'AI for Kids',
    description: 'Explore the world of Artificial Intelligence with fun, interactive projects.',
  },
  {
    emoji: '🎤',
    title: 'Public Speaking',
    description: 'Build confidence and present your ideas like a pro.',
  },
  {
    emoji: '🧘‍♀️',
    title: 'Mindfulness & Focus',
    description: 'Practice breathing, reduce stress, and stay focused in class and at home.',
  },
  {
    emoji: '🗺️',
    title: 'World Explorer',
    description: 'Travel the globe virtually and learn cultures, maps, and languages!',
  },
];

const SmartCourses = () => {
  return (
    <section className="smart-courses">
      <h2 className="section-title">Smart Learning. Real Skills. 🚀</h2>
      <div className="course-grid">
        {courses.map((course, index) => (
          <div className="course-card" key={index}>
            <div className="course-icon">{course.emoji}</div>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SmartCourses;
