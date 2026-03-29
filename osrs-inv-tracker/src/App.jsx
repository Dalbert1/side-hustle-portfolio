import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Activity from './pages/Activity'
import MySetups from './pages/MySetups'
import AddActivity from './pages/AddActivity'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-medieval-pattern">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/activity/:slug" element={<Activity />} />
              <Route
                path="/my-setups"
                element={
                  <ProtectedRoute>
                    <MySetups />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-activity"
                element={
                  <ProtectedRoute>
                    <AddActivity />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  )
}
