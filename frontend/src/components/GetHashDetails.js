'use client'

import { useState } from 'react'
import Navbar from './Navbar'
import { getContract } from '../lib/contract'
import { Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { ethers } from 'ethers'

export default function GetHashDetails() {
  const [hashInput, setHashInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([]) // array of records
  const [latestOnly, setLatestOnly] = useState(false)

  const roleNames = {
    0: 'Digital Asset',
    1: 'Certificate',
    2: 'Media Record',
    3: 'Legal Document',
  }

  const normalize = (arr) =>
    arr.map((i) => ({
      id: Number(i.id),
      role: Number(i.role),
      fileHash: i.fileHash,
      timestamp: Number(i.timestamp),
      isVerified: Boolean(i.isVerified),
      uploader: i.uploader,
      issuer: i.issuer,
    }))

  const handleSearch = async () => {
    setError('')
    setResults([])
    // basic validation: must be 0x + 64 hex chars
    const cleaned = (hashInput || '').trim()
    if (!cleaned.startsWith('0x') || cleaned.length !== 66) {
      setError('Enter a 0x-prefixed bytes32 hash (0x + 64 hex chars).')
      return
    }

    setLoading(true)
    try {
      const { contract } = await getContract()
      if (!contract) throw new Error('Contract connection failed')

      if (latestOnly) {
        const res = await contract.getLatestHashDetails(cleaned)
        setResults([res] && normalize([res]))
      } else {
        const res = await contract.getHashDetails(cleaned)
        setResults(res && normalize(res))
      }
    } catch (e) {
      console.error(e)
      // contract revert message appears in e.reason or e.data?.message
      const reason =
        e.reason ||
        e.data?.message ||
        e.error?.message ||
        e.message ||
        'Unknown error'
      setError(
        reason.includes('Hash not found')
          ? 'Hash not found on chain.'
          : `Error: ${reason}`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          Get Hash Details
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Paste a 0x-prefixed bytes32 hash to verify. Shows category, uploader,
          issuer and timestamp.
        </p>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6">
          <label className="text-sm text-slate-300 block mb-2">
            File Hash (bytes32)
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="0x..."
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-700/40 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none"
              disabled={loading}
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-5 py-3 bg-linear-to-r from-indigo-600 to-sky-500 rounded-xl text-white font-semibold disabled:opacity-50"
            >
              {loading ? <Loader className="animate-spin w-5 h-5" /> : 'Search'}
            </button>
          </div>

          <div className="mt-4 flex items-center space-x-4 text-sm">
            <label className="text-slate-400 flex items-center gap-2">
              <input
                type="checkbox"
                checked={latestOnly}
                onChange={(e) => setLatestOnly(e.target.checked)}
                className="accent-indigo-500"
              />
              Show only latest record
            </label>
            <p className="text-slate-400">
              If unchecked, full history (audit trail) is returned.
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-700/10 border border-red-600/20 rounded-xl text-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>{error}</div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((r, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold">
                      {roleNames[r.role] || `Role ${r.role}`}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">ID: {r.id}</p>
                  </div>

                  <div className="text-right text-sm">
                    <div className="text-slate-300">
                      {r.isVerified ? 'Verified' : 'Unverified'}
                    </div>
                    <div className="text-slate-400 mt-1">
                      {new Date(r.timestamp * 1000).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                  <div>
                    <div className="font-medium text-slate-200">Uploader</div>
                    <div className="break-all">{r.uploader}</div>
                  </div>
                  <div>
                    <div className="font-medium text-slate-200">Issuer</div>
                    <div className="break-all">
                      {r.issuer === '0x0000000000000000000000000000000000000000'
                        ? '-'
                        : r.issuer}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="font-medium text-slate-200">File Hash</div>
                    <div className="font-mono text-sm text-slate-400 break-all">
                      {r.fileHash}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !loading && !error && (
          <div className="mt-6 text-center text-slate-400">
            No results yet. Enter a hash and press Search.
          </div>
        )}
      </div>
    </div>
  )
}
