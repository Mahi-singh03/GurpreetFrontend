import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Exam = () => {
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()

  // Sample questions - replace with your actual questions
  const questions = [
    {
      id: 1,
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: "4"
    },
    // Add more questions
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Calculate score
      const score = questions.reduce((acc, question) => (
        answers[question.id] === question.correct ? acc + 1 : acc
      ), 0)

      await axios.post('https://backend-mqy5.onrender.com/api/users/submit-exam', 
        { score },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      )
      
      navigate('/score')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Exam</h2>
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            <div key={question.id} className="mb-6">
              <p className="font-medium mb-2">{question.text}</p>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      onChange={() => setAnswers(prev => ({...prev, [question.id]: option}))}
                      className="form-radio"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Submit Exam
          </button>
        </form>
      </div>
    </div>
  )
}

export default Exam