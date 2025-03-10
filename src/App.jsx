import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Exam from './pages/Exam'
import Score from './pages/Score'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Redirect root path based on auth status */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/score" element={<Score />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

// New component to handle root path redirect
function HomeRedirect() {
  const { currentUser } = useAuth()
  
  return currentUser ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/register" replace />
  )
}

export default App