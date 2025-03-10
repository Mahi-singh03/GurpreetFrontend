import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Score = () => {
  const { user } = useAuth()
  const [scoreData, setScoreData] = useState(null)

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await axios.get('https://backend-mqy5.onrender.com/api/users/score', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        })
        setScoreData(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchScore()
  }, [])

  if (!scoreData) return <div className="text-center mt-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Your Exam Results</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
            <span className="font-medium">Name:</span>
            <span>{scoreData.name}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
            <span className="font-medium">Score:</span>
            <span className="text-green-600 font-bold">{scoreData.score}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
            <span className="font-medium">Status:</span>
            <span className={`px-2 py-1 rounded ${scoreData.hasGivenExam ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {scoreData.hasGivenExam ? 'Exam Completed' : 'Exam Pending'}
            </span>
          </div>
        </div>

        {!scoreData.hasGivenExam && (
          <p className="mt-6 text-center text-gray-600">
            You haven't taken the exam yet. Go to the dashboard to start!
          </p>
        )}
      </div>
    </div>
  )
}

export default Score