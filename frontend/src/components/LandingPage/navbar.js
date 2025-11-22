'use client'
import { useState } from 'react'
import Link from 'next/link'
import WalletConnect from '../ConnectWallet'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <nav className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => router.push('/')}
            className="text-xl font-bold text-white cursor-pointer"
          >
            Authenticity Vault
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-slate-300">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <Link href="/app" className="hover:text-white transition">
              Dashboard
            </Link>
            <Link href="/app/verify" className="hover:text-white transition">
              Verify
            </Link>
            <Link href="/app/upload" className="hover:text-white transition">
              Upload
            </Link>

            <WalletConnect />
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden pb-4 space-y-2 text-slate-300">
            <Link
              onClick={() => setOpen(false)}
              href="/"
              className="block hover:text-white py-2"
            >
              Home
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/app"
              className="block hover:text-white py-2"
            >
              Dashboard
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/app/verify"
              className="block hover:text-white py-2"
            >
              Verify
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/app/upload"
              className="block hover:text-white py-2"
            >
              Upload
            </Link>

            <WalletConnect />
          </div>
        )}
      </div>
    </nav>
  )
}
