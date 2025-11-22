'use client'

import Navbar from './Navbar'
import { getContract } from '../lib/contract'
import { useState } from 'react'
import { Scale, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { ethers } from 'ethers'

export default function ViewLegalDocument() {
  const [docs, setDocs] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function viewDoc() {
    setLoading(true)
    setError('')
    setDocs(null)

    try {
      const { contract, signer } = await getContract()
      if (!contract) {
        setError('Failed to connect to contract')
        setLoading(false)
        return
      }

      // Directly get the hex address as a string
      const signerAddress = await signer.getAddress()
      const userAddress = ethers.getAddress(signerAddress) // ethers v6 method to normalize address

      // Check registration
      const isRegistered = await contract.trustedLegalIdentity(userAddress)

      if (!isRegistered) {
        setError('You are not a registered legal authority')
        setLoading(false)
        return
      }

      const myDocs = await contract.viewMyLegalDocuments()

      if (myDocs.length === 0) {
        setError('No legal documents found for your account')
      } else {
        setDocs(myDocs)
      }
    } catch (e) {
      console.error('Full error object:', e)

      const reason =
        e.reason ||
        e.data?.message ||
        e.error?.message ||
        e.error?.reason ||
        e.info?.error?.message ||
        'Unknown error — check contract or ABI'

      setError(`Error: ${reason}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-20 h-20 bg-linear-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            View My Legal Documents
          </h1>
          <p className="text-xl text-slate-400 mb-12">
            Access and verify legal documents uploaded by you
          </p>

          <button
            onClick={viewDoc}
            disabled={loading}
            className="px-8 py-3 bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl font-semibold flex items-center justify-center transition shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>View Documents</>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-600/10 border border-red-500/30 rounded-xl mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-300 font-semibold mb-1">Error</h3>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {docs && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 min-h-[200px]">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-700">
                <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Documents Found
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {docs.length} blockchain record(s) retrieved successfully
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {docs.map((hash, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/30 rounded-lg p-4 flex justify-between items-center"
                  >
                    <span className="text-slate-200 font-mono text-sm">
                      {hash}
                    </span>
                    <span className="text-emerald-400 font-semibold text-sm">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Authority Access</h3>
            <div className="space-y-3">
              {[
                'Only your uploaded documents are visible',
                'Document hashes are used to retrieve blockchain data',
                'All access attempts are logged and traceable',
                'Ensures compliance with legal verification requirements',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-slate-400 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
