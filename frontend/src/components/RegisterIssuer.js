'use client'

import { useState } from 'react'
import Navbar from './Navbar'
import { getContract } from '../lib/contract'
import {
  UserPlus,
  FileCheck,
  Scale,
  Newspaper,
  Building,
  Globe,
  Loader,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export default function RegisterIssuer() {
  const [role, setRole] = useState('1')
  const [issuer, setIssuer] = useState('')
  const [org, setOrg] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const roleOptions = [
    {
      label: 'Certificate Issuer',
      value: '1',
      icon: <FileCheck className="w-6 h-6" />,
      description:
        'Educational institutions, training centers, professional certification bodies',
      color: 'from-indigo-600 to-indigo-800',
    },
    {
      label: 'Legal Authority',
      value: '3',
      icon: <Scale className="w-6 h-6" />,
      description: 'Government agencies, courts, legal verification entities',
      color: 'from-purple-600 to-purple-800',
    },
    {
      label: 'Media Entity',
      value: '2',
      icon: <Newspaper className="w-6 h-6" />,
      description:
        'News organizations, content creators, media verification services',
      color: 'from-sky-600 to-sky-800',
    },
  ]

  async function register() {
    if (!issuer || !org || !url) {
      setStatus({ type: 'error', message: 'Please fill in all fields!' })
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const { contract } = await getContract()
      const tx = await contract.registerAsTrustedIssuerOrLegalIdentity(
        parseInt(role),
        issuer,
        org,
        url
      )
      await tx.wait()

      setStatus({ type: 'success', message: 'Entity registered successfully!' })
      setIssuer('')
      setOrg('')
      setUrl('')
      setRole('1')
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

  const selectedRoleData = roleOptions.find((opt) => opt.value === role)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-linear-to-br from-indigo-600 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Register Trusted Entity
            </h1>
            <p className="text-xl text-slate-400">
              Become an authorized issuer or verification authority on the
              platform
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Role Selection Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sticky top-24">
                <h3 className="text-white font-semibold mb-4">
                  Select Entity Type
                </h3>
                <div className="space-y-3">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRole(option.value)}
                      className={`w-full flex items-start p-4 rounded-xl border-2 transition text-left ${
                        role === option.value
                          ? 'border-indigo-500 bg-indigo-600/20'
                          : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mr-3 bg-linear-to-br ${option.color}`}
                      >
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <span
                          className={`font-medium block mb-1 ${
                            role === option.value
                              ? 'text-white'
                              : 'text-slate-300'
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="text-xs text-slate-400 leading-tight">
                          {option.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
                {/* Selected Role Banner */}
                {selectedRoleData && (
                  <div
                    className={`mb-8 p-6 rounded-xl bg-linear-to-br ${selectedRoleData.color} bg-opacity-10 border-2 border-opacity-30`}
                    style={{
                      borderColor: selectedRoleData.color
                        .split(' ')[0]
                        .replace('from-', ''),
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center bg-linear-to-br ${selectedRoleData.color}`}
                      >
                        {selectedRoleData.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {selectedRoleData.label}
                        </h3>
                        <p className="text-slate-300 text-sm">
                          {selectedRoleData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Issuer Address */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">
                    Issuer Wallet Address
                  </label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Ethereum wallet address to be registered as trusted entity
                  </p>
                </div>

                {/* Organization Name */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Harvard University"
                      value={org}
                      onChange={(e) => setOrg(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Official name of the organization
                  </p>
                </div>

                {/* Organization URL */}
                <div className="mb-8">
                  <label className="block text-white font-semibold mb-3">
                    Organization Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Official website URL for verification purposes
                  </p>
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

                {/* Register Button */}
                <button
                  onClick={register}
                  disabled={loading || !issuer || !org || !url}
                  className="w-full px-6 py-4 bg-linear-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white rounded-xl font-semibold flex items-center justify-center transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Register Entity
                    </>
                  )}
                </button>
              </div>

              {/* Requirements Card */}
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">
                  Registration Requirements
                </h3>
                <div className="space-y-3">
                  {[
                    'Valid Ethereum wallet address',
                    'Official organization name',
                    'Verified organization website',
                    'Admin approval may be required',
                    'Connected wallet for transaction signing',
                  ].map((req, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-slate-400 text-sm">{req}</p>
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
