import { useState } from 'react'

import {
  Shield,
  FileCheck,
  Scale,
  Newspaper,
  ChevronRight,
  Upload,
  CheckCircle,
  Users,
  Lock,
  Globe,
  Zap,
} from 'lucide-react'

// Navbar Component
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold text-white">
              Authenticity Vault
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-white transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-300 hover:text-white transition"
            >
              How It Works
            </a>
            <a
              href="#roles"
              className="text-slate-300 hover:text-white transition"
            >
              Roles
            </a>
            <a
              href="#upload"
              className="text-slate-300 hover:text-white transition"
            >
              Upload
            </a>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
              Launch App
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a
              href="#features"
              className="block text-slate-300 hover:text-white py-2"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-slate-300 hover:text-white py-2"
            >
              How It Works
            </a>
            <a
              href="#roles"
              className="block text-slate-300 hover:text-white py-2"
            >
              Roles
            </a>
            <a
              href="#upload"
              className="block text-slate-300 hover:text-white py-2"
            >
              Upload
            </a>
            <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
              Launch App
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
