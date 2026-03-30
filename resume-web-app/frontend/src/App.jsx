import { ThemeProvider } from './context/ThemeContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Highlights from './components/Highlights'
import Education from './components/Education'
import Contact from './components/Contact'

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-bg text-slate-900 dark:text-text-primary font-sans transition-colors duration-200">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main-content">
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Highlights />
          <Education />
          <Contact />
        </main>
        <footer className="border-t border-slate-200 dark:border-border py-8 text-center text-slate-500 dark:text-text-secondary text-xs font-mono">
          <p>Dylan Albert - AI Engineer &nbsp;·&nbsp; Built with React + Vite + Tailwind</p>
        </footer>
      </div>
    </ThemeProvider>
  )
}
