'use client'

import Navbar from './Navbar'
import { getContract } from '../lib/contract'
import { keccak256, arrayify } from 'ethers'
import { useState } from 'react'
import {
  FileCheck,
  User,
  Upload,
  Loader,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export default function IssueCertificate() {
  const [student, setStudent] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  async function issue() {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a certificate file!' })
      return
    }

    if (!student) {
      setStatus({ type: 'error', message: 'Please enter student address!' })
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const { contract, signer } = await getContract()
      const issuer = await signer.getAddress()

      // hash the file
      const buffer = await file.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      const fileHash = keccak256(bytes)

      // send tx
      const tx = await contract.issueCertificate(issuer, student, fileHash)
      const receipt = await tx.wait()

      // extract event from receipt
      const event = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log)
          } catch {
            return null
          }
        })
        .filter(Boolean)
        .find((e) => e.name === 'CertificateIssued')

      if (event) {
        const { fileHash: hash, issuer, student, timestamp } = event.args

        setStatus({
          type: 'success',
          message: `Certificate issued successfully! Hash: ${hash}`,
        })
      } else {
        setStatus({
          type: 'success',
          message: 'Certificate issued successfully (no event found).',
        })
      }

      setStudent('')
      setFile(null)
    } catch (e) {
      console.error('Full error object:', e)

      let reason =
        e.reason ||
        e.data?.message ||
        e.error?.message ||
        e.error?.reason ||
        'Unknown error'

      setStatus({
        type: 'error',
        message: `Error: ${reason}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-linear-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Issue Certificate
            </h1>
            <p className="text-xl text-slate-400">
              Create verifiable certificates for students on the blockchain
            </p>
          </div>

          {/* Issue Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
            {/* Student Wallet Input */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-4 text-lg">
                Student Wallet Address
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                  value={student}
                  onChange={(e) => setStudent(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Enter the Ethereum wallet address of the certificate recipient
              </p>
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-4 text-lg">
                Certificate File
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={loading}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
                    file
                      ? 'border-purple-500 bg-purple-600/10'
                      : 'border-slate-600 bg-slate-700/20 hover:border-purple-500'
                  } ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  {file ? (
                    <>
                      <p className="text-white font-medium mb-2">{file.name}</p>
                      <p className="text-slate-400 text-sm">
                        {(file.size / 1024).toFixed(2)} KB • Click to change
                        file
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-white font-medium mb-2">
                        Drop certificate here or click to browse
                      </p>
                      <p className="text-slate-400 text-sm">
                        Supports PDF, PNG, JPG
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {status.message && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start space-x-3 ${
                  status.type === 'success'
                    ? 'bg-emerald-600/20 border border-emerald-500/30'
                    : 'bg-red-600/20 border border-red-500/30'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <p
                  className={
                    status.type === 'success'
                      ? 'text-emerald-300'
                      : 'text-red-300'
                  }
                >
                  {status.message}
                </p>
              </div>
            )}

            {/* Issue Button */}
            <button
              onClick={issue}
              disabled={loading || !file || !student}
              className="w-full px-6 py-4 bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl font-semibold flex items-center justify-center transition shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Issuing Certificate...
                </>
              ) : (
                <>
                  <FileCheck className="w-5 h-5 mr-2" />
                  Issue Certificate
                </>
              )}
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">
                Certificate Issuance Process
              </h3>
              <div className="space-y-3">
                {[
                  'Enter recipient wallet address',
                  'Upload certificate document',
                  'System generates cryptographic hash',
                  'Certificate stored on blockchain',
                  'Recipient can verify authenticity',
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-purple-400 text-xs font-bold">
                        {idx + 1}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Requirements</h3>
              <div className="space-y-3">
                {[
                  {
                    label: 'Authorized Issuer',
                    desc: 'Must be registered as trusted issuer',
                  },
                  {
                    label: 'Valid Wallet',
                    desc: 'Recipient must have Ethereum address',
                  },
                  {
                    label: 'Certificate File',
                    desc: 'PDF, PNG, or JPG format',
                  },
                  {
                    label: 'Connected Wallet',
                    desc: 'MetaMask or compatible wallet',
                  },
                ].map((req, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium">
                        {req.label}
                      </p>
                      <p className="text-slate-400 text-xs">{req.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
