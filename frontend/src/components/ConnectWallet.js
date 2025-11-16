'use client'

import { useState, useEffect } from 'react'
import { Wallet, LogOut, CheckCircle } from 'lucide-react'

export default function WalletConnect() {
  const [address, setAddress] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  async function checkIfWalletIsConnected() {
    if (!window.ethereum) return

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      })

      if (accounts.length > 0) {
        setAddress(accounts[0])
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  async function connect() {
    if (!window.ethereum) {
      alert('MetaMask not found! Please install MetaMask to use this feature.')
      return
    }

    setIsConnecting(true)

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      setAddress(accounts[0])

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // User disconnected wallet
      setAddress('')
    } else {
      // User switched accounts
      setAddress(accounts[0])
    }
  }

  function disconnect() {
    setAddress('')
    setShowDropdown(false)
    // Remove event listener
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
    }
  }

  function copyAddress() {
    navigator.clipboard.writeText(address)
    alert('Address copied to clipboard!')
  }

  // If wallet is connected, show address dropdown
  if (address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-lg font-medium transition shadow-lg shadow-emerald-600/30"
        >
          <CheckCircle className="w-4 h-4" />
          <span className="hidden sm:inline">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="sm:hidden">{address.slice(0, 4)}...</span>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 animate-fadeIn">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-xs font-medium">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-mono text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button
                  onClick={copyAddress}
                  className="text-indigo-400 hover:text-indigo-300 text-xs transition"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={disconnect}
                className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-slate-700/50 rounded-lg transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}

        {/* Click outside to close dropdown */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          ></div>
        )}
      </div>
    )
  }

  // If wallet is not connected, show connect button
  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white rounded-lg font-medium transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isConnecting ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  )
}
