import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [examStatus, setExamStatus] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('https://backend-mqy5.onrender.com/api/users/score', {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        })
        setExamStatus(res.data.hasGivenExam)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUserData()
  }, [])

  const startExam = () => {
    if (examStatus) {
      alert('You have already taken the exam!')
      navigate('/score')
    } else {
      navigate('/exam')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <button 
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <button
            onClick={startExam}
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
          >
            {examStatus ? 'View Score' : 'Start Exam'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard