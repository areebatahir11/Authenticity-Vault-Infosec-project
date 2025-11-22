'use client'

import { getContract } from '../lib/contract'
import { useState } from 'react'
import { keccak256 } from 'ethers'
import Navbar from './Navbar'
import {
  Upload as UploadIcon,
  FileCheck,
  Scale,
  Newspaper,
  AlertCircle,
  CheckCircle,
  Loader,
} from 'lucide-react'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('0')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const roleOptions = [
    {
      label: 'Digital Assets',
      value: '0',
      icon: <FileCheck className="w-5 h-5" />,
      description: 'General digital files and assets',
    },
    {
      label: 'Media Records',
      value: '2',
      icon: <Newspaper className="w-5 h-5" />,
      description: 'News articles, videos, and media content',
    },
    {
      label: 'Legal Documents',
      value: '3',
      icon: <Scale className="w-5 h-5" />,
      description: 'Contracts, certificates, and legal files',
    },
  ]

  async function uploadFile() {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a file to upload!' })
      return
    }
    const { contract, signer } = await getContract()

    if (!contract) {
      setStatus({
        type: 'error',
        message: 'Failed to connect to contract. Please connect your wallet.',
      })
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const arrayBuffer = await file.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      const userAddress = await signer.getAddress()

      const fileHash = keccak256(bytes)

      // 1) Listen BEFORE transaction
      contract.once('FileUploaded', (hash, uploader, role, timestamp) => {
        console.log('Event received:', hash, uploader, role, timestamp)
        setStatus({
          type: 'success',
          message: `File uploaded successfully! Hash: ${hash}`,
        })
      })

      // 2) Now send transaction
      const tx = await contract.uploadFile(
        fileHash,
        userAddress,
        parseInt(role)
      )

      // 3) Wait for mining
      await tx.wait()

      setFile(null)
    } catch (e) {
      console.error('Full error object:', e)

      let reason =
        e.reason ||
        e.data?.message ||
        e.error?.message ||
        e.error?.reason ||
        e.info?.error?.message ||
        'Unknown error — check contract or ABI'

      setStatus({
        type: 'error',
        message: `Error: ${reason}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setStatus({ type: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Upload to Blockchain
            </h1>
            <p className="text-xl text-slate-400">
              Securely store and verify your digital files on the blockchain
            </p>
          </div>

          {/* Main Upload Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
            {/* Document Type Selection */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-4 text-lg">
                Select Document Type
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRole(option.value)}
                    className={`flex flex-col items-start p-4 rounded-xl border-2 transition ${
                      role === option.value
                        ? 'border-indigo-500 bg-indigo-600/20'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                  >
                    <div
                      className={`mb-3 ${
                        role === option.value
                          ? 'text-indigo-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {option.icon}
                    </div>
                    <span
                      className={`font-medium mb-1 ${
                        role === option.value ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="text-xs text-slate-400 text-left">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Area */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-4 text-lg">
                Upload Document
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={loading}
                />
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
                    file
                      ? 'border-indigo-500 bg-indigo-600/10'
                      : 'border-slate-600 bg-slate-700/20 hover:border-indigo-500'
                  } ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <UploadIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
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
                        Drop your file here or click to browse
                      </p>
                      <p className="text-slate-400 text-sm">
                        Supports PDF, PNG, JPG, MP4 up to 10MB
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

            {/* Upload Button */}
            <button
              onClick={uploadFile}
              disabled={loading || !file}
              className="w-full px-6 py-4 bg-linear-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white rounded-xl font-semibold flex items-center justify-center transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Uploading to Blockchain...
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Upload to Blockchain
                </>
              )}
            </button>

            {/* Privacy Note */}
            <div className="mt-6 flex items-start space-x-3 text-sm text-slate-400 bg-slate-700/30 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <p>
                Your document is hashed locally using SHA-256. Only the
                cryptographic hash is stored on the blockchain, ensuring
                complete privacy. The original file never leaves your device.
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Immutable Records
              </h3>
              <p className="text-slate-400 text-sm">
                Once uploaded, records cannot be altered or deleted
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-sky-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Instant Verification
              </h3>
              <p className="text-slate-400 text-sm">
                Verify authenticity anytime, anywhere
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Scale className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Legal Compliance
              </h3>
              <p className="text-slate-400 text-sm">
                Meet regulatory requirements with blockchain proof
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
