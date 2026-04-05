import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Feed from './pages/Feed'
import Recipe from './pages/Recipe'
import RecipeForm from './pages/RecipeForm'
import GroceryCart from './pages/GroceryCart'
import ProfileSettings from './pages/ProfileSettings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/my-recipes" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/recipe/:id" element={<ProtectedRoute><Recipe /></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute><RecipeForm /></ProtectedRoute>} />
      <Route path="/edit/:id" element={<ProtectedRoute><RecipeForm isEdit /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><GroceryCart /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen text-bark font-sans">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="bg-cream rounded-xl min-h-[calc(100vh-3.5rem)] mt-4 px-1 sm:px-2 shadow-lg shadow-black/20">
                <AppRoutes />
              </div>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  )
}
