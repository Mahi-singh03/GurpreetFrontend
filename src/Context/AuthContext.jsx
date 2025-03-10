import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  // Fetch user data when token exists on initial load
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get('https://backend-mqy5.onrender.com/api/users/score', {
            headers: { 'x-auth-token': token }
          })
          setUser(res.data)
        } catch (err) {
          console.error(err)
          logout()
        }
      }
    }
    fetchUser()
  }, [token])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    setToken(token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)