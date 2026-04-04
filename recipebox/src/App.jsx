import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Recipe from './pages/Recipe'
import RecipeForm from './pages/RecipeForm'
import Login from './pages/Login'
import Signup from './pages/Signup'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-center py-20 text-warm-gray text-sm">Loading...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return <div className="text-center py-20 text-warm-gray text-sm">Loading...</div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/recipe/:id" element={<ProtectedRoute><Recipe /></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute><RecipeForm /></ProtectedRoute>} />
      <Route path="/edit/:id" element={<ProtectedRoute><RecipeForm isEdit /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <div className="min-h-screen bg-cream text-bark font-sans">
          <Navbar />
          <AppRoutes />
        </div>
      </AuthProvider>
    </HashRouter>
  )
}
