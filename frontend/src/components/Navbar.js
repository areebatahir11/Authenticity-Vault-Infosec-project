'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [address, setAddress] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  async function connect() {
    if (!window.ethereum) return alert('MetaMask not found!')

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })

    setAddress(accounts[0])
  }

  return (
    <nav className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition"
          >
            <Shield className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold text-white">
              Authenticity Vault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className="text-slate-300 hover:text-white transition"
            >
              Upload
            </Link>
            <Link
              href="/validate"
              className="text-slate-300 hover:text-white transition"
            >
              Validate
            </Link>

            {/* Wallet Connect Button */}
            <button
              onClick={connect}
              className="px-4 py-2 bg-linear-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white rounded-lg font-medium transition shadow-lg shadow-indigo-600/30"
            >
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : 'Connect Wallet'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:bg-slate-800 rounded-lg transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
            <Link
              href="/dashboard"
              className="block text-slate-300 hover:text-white hover:bg-slate-800 py-2 px-4 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className="block text-slate-300 hover:text-white hover:bg-slate-800 py-2 px-4 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              Upload
            </Link>
            <Link
              href="/validate"
              className="block text-slate-300 hover:text-white hover:bg-slate-800 py-2 px-4 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              Validate
            </Link>
            <button
              onClick={connect}
              className="w-full px-4 py-2 bg-linear-to-r from-indigo-600 to-sky-500 text-white rounded-lg font-medium transition"
            >
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : 'Connect Wallet'}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
