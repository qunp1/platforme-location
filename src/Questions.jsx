import React from 'react';
import { copy } from './copy.js';
import AnimatedDisclosure from './components/AnimatedDisclosure.jsx';

export default function Questions({ questions = copy.questions, limit }) {
  return (
    <div className="questions-list">
      {questions.slice(0, limit).map((question) => (
        <AnimatedDisclosure key={question.title} title={question.title}>
          <p>{question.text}</p>
        </AnimatedDisclosure>
      ))}
    </div>
  );
}
