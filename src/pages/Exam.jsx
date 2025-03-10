import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Exam.css';

const Exam = () => {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Sample exam questions
  const questions = [
    { id: 1, text: "What is 5 + 3?", options: ["6", "7", "8", "9"], correct: "8" },
    { id: 2, text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Venus", "Jupiter"], correct: "Mars" },
    { id: 3, text: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Lisbon"], correct: "Paris" },
    { id: 4, text: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: "Carbon Dioxide" },
    { id: 5, text: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Hemingway", "Tolkien", "Dickens"], correct: "Shakespeare" }
  ];

  const handleAnswerChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate score
      const score = questions.reduce((acc, question) => (
        answers[question.id] === question.correct ? acc + 1 : acc
      ), 0);

      const response = await fetch('https://backend-production-e56f.up.railway.app/api/users/submit-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ score })
      });

      if (!response.ok) {
        throw new Error('Failed to submit exam');
      }

      navigate('/score');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="exam-container">
      <h1 className="exam-title">Online Exam</h1>
      <form onSubmit={handleSubmit} className="exam-form">
        {questions.map((question) => (
          <div key={question.id} className="question-block">
            <p className="question-text">{question.text}</p>
            <div className="options-container">
              {question.options.map((option) => (
                <label key={option} className="option">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className="option-input"
                  />
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Exam"}
        </button>
      </form>
    </div>
  );
};

export default Exam;