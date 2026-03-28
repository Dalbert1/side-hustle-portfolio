import { HashRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Providers from './pages/Providers'
import ProviderDetail from './pages/ProviderDetail'

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-tools-pattern">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/providers/:id" element={<ProviderDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}
