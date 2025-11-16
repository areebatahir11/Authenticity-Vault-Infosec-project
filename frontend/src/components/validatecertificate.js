'use client'

import Navbar from './Navbar'
import { getContract } from '../lib/contract'
import { keccak256, arrayify } from 'ethers'
import { useState } from 'react'
import {
  Shield,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
} from 'lucide-react'

export default function ValidateCertificate() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function validate() {
    if (!file) {
      setResult({ valid: false, message: 'Please select a certificate file!' })
      return
    }

    const contract = await getContract()
    if (!contract) {
      setResult({
        valid: false,
        message: 'Failed to connect to contract. Please connect your wallet.',
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      const fileHash = keccak256(arrayify(bytes))

      const isValid = await contract.uploadCertificateForValidation(fileHash)

      setResult({
        valid: isValid,
        message: isValid
          ? 'Certificate is authentic and verified on the blockchain'
          : 'Certificate not found or invalid',
        hash: fileHash,
      })
    } catch (err) {
      console.error(err)
      setResult({
        valid: false,
        message: 'Error validating certificate. Please try again.',
        error: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-linear-to-br from-indigo-600 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Validate Certificate
            </h1>
            <p className="text-xl text-slate-400">
              Verify the authenticity of certificates against blockchain records
            </p>
          </div>

          {/* Validation Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-4 text-lg">
                Upload Certificate
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={loading}
                  accept=".pdf,.png,.jpg,.jpeg"
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

            {/* Validate Button */}
            <button
              onClick={validate}
              disabled={loading || !file}
              className="w-full px-6 py-4 bg-linear-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white rounded-xl font-semibold flex items-center justify-center transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Validate Certificate
                </>
              )}
            </button>

            {/* Result Display */}
            {result && (
              <div
                className={`mt-6 p-6 rounded-xl border-2 ${
                  result.valid
                    ? 'bg-emerald-600/10 border-emerald-500/30'
                    : 'bg-red-600/10 border-red-500/30'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      result.valid ? 'bg-emerald-600/20' : 'bg-red-600/20'
                    }`}
                  >
                    {result.valid ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        result.valid ? 'text-emerald-300' : 'text-red-300'
                      }`}
                    >
                      {result.valid
                        ? 'Valid Certificate ✓'
                        : 'Invalid Certificate ✗'}
                    </h3>
                    <p
                      className={
                        result.valid ? 'text-emerald-200' : 'text-red-200'
                      }
                    >
                      {result.message}
                    </p>
                    {result.hash && (
                      <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                        <p className="text-slate-400 text-xs mb-1">
                          Document Hash:
                        </p>
                        <p className="text-slate-300 text-sm font-mono break-all">
                          {result.hash}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    How Validation Works
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Your certificate is hashed and compared against blockchain
                    records. If the hash matches, the certificate is authentic.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-sky-600/20 rounded-lg flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    Privacy Guaranteed
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Your file is processed locally. Only the hash is used for
                    validation—the file itself never leaves your device.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <h3 className="text-white font-semibold mb-6 text-lg">
              Validation Process
            </h3>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Upload Certificate',
                  desc: 'Select the certificate file you want to verify',
                },
                {
                  step: '2',
                  title: 'Hash Generation',
                  desc: 'System creates a cryptographic hash of your file',
                },
                {
                  step: '3',
                  title: 'Blockchain Query',
                  desc: 'Hash is checked against blockchain records',
                },
                {
                  step: '4',
                  title: 'Result Display',
                  desc: 'Receive instant validation result',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-indigo-400 font-bold text-sm">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
