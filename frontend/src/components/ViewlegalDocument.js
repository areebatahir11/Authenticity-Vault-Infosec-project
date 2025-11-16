'use client'

import Navbar from './Navbar'
import { getContract } from '../lib/contract'
import { keccak256, arrayify } from 'ethers'
import { useState } from 'react'
import {
  Scale,
  Upload,
  FileText,
  Loader,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

export default function ViewLegalDocument() {
  const [file, setFile] = useState(null)
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function viewDoc() {
    if (!file) {
      setError('Please select a file!')
      return
    }

    const contract = await getContract()
    if (!contract) {
      setError('Failed to connect to contract')
      return
    }

    setLoading(true)
    setError('')
    setDoc(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      const fileHash = keccak256(arrayify(bytes))

      const record = await contract.viewLegalDocByAuthority(fileHash)
      setDoc(record)
    } catch (err) {
      console.error(err)
      setError(
        'Error fetching document. This may not be a registered legal document.'
      )
      setDoc(null)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setError('')
    setDoc(null)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-linear-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Scale className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              View Legal Document
            </h1>
            <p className="text-xl text-slate-400">
              Access and verify legal documents stored on the blockchain
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 sticky top-24">
                <h3 className="text-white font-semibold mb-6 text-lg">
                  Upload Document
                </h3>

                {/* File Upload */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={loading}
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                        file
                          ? 'border-purple-500 bg-purple-600/10'
                          : 'border-slate-600 bg-slate-700/20 hover:border-purple-500'
                      } ${
                        loading
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      {file ? (
                        <>
                          <p className="text-white font-medium mb-1 text-sm">
                            {file.name}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-white font-medium mb-1 text-sm">
                            Upload legal document
                          </p>
                          <p className="text-slate-400 text-xs">
                            PDF, PNG, JPG
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <button
                  onClick={viewDoc}
                  disabled={loading || !file}
                  className="w-full px-6 py-3 bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl font-semibold flex items-center justify-center transition shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      View Document
                    </>
                  )}
                </button>

                {/* Info */}
                <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Only legal authorities can view complete document records.
                      The document hash is used to retrieve blockchain data.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 min-h-[400px]">
                {!doc && !error && !loading && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-20 h-20 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-6">
                      <FileText className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-400 mb-2">
                      No Document Loaded
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Upload a legal document to view its blockchain record
                    </p>
                  </div>
                )}

                {error && (
                  <div className="p-6 bg-red-600/10 border border-red-500/30 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-red-300 font-semibold mb-1">
                          Error
                        </h3>
                        <p className="text-red-200 text-sm">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {doc && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-700">
                      <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Document Found
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Blockchain record retrieved successfully
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-4">
                        Document Details
                      </h4>
                      <pre className="text-slate-300 text-sm font-mono overflow-x-auto whitespace-pre-wrap wrap-break-words bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        {typeof doc === 'string'
                          ? doc
                          : JSON.stringify(doc, null, 2)}
                      </pre>
                    </div>

                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Scale className="w-5 h-5 text-purple-400" />
                          <span className="text-slate-400 text-xs font-medium">
                            Document Type
                          </span>
                        </div>
                        <p className="text-white font-semibold">
                          Legal Document
                        </p>
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-slate-400 text-xs font-medium">
                            Status
                          </span>
                        </div>
                        <p className="text-white font-semibold">Verified</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">
                  Authority Access
                </h3>
                <div className="space-y-3">
                  {[
                    'Only registered legal authorities can access full document records',
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
      </div>
    </div>
  )
}
