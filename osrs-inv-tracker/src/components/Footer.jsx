import { Swords } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Swords className="w-4 h-4 text-gold-dim" />
          <span className="text-sm text-parchment-dim font-medium">OSRS Activity Helper</span>
        </div>
        <p className="text-xs text-parchment-dim/60">
          Not affiliated with Jagex Ltd. Old School RuneScape is a trademark of Jagex Ltd.
        </p>
      </div>
    </footer>
  )
}
