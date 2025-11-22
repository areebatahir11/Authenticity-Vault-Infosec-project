'use client'

import { useState, useEffect } from 'react'
import { getContract } from '../lib/contract'
import Navbar from './Navbar'
import {
  ShieldCheck,
  Landmark,
  Newspaper,
  AlertCircle,
  Loader,
} from 'lucide-react'

export default function AuthoritiesRegistered() {
  const [issuers, setIssuers] = useState([])
  const [legalAuthorities, setLegalAuthorities] = useState([])
  const [mediaEntities, setMediaEntities] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // NEW: track active tab
  const [activeTab, setActiveTab] = useState('issuers')

  const roleNames = {
    0: 'Digital Issuer',
    1: 'Certificate Issuer',
    2: 'Media Entity',
    3: 'Legal Authority',
  }

  const fetchAuthorities = async () => {
    try {
      setLoading(true)
      const { contract } = await getContract()

      const _issuers = await contract.getRegisteredIssuers()
      const _legal = await contract.getRegisteredLegalAuthorities()
      const _media = await contract.getRegisteredMediaEntities()

      // NORMALIZE FIX
      const normalize = (arr) =>
        arr.map((i) => ({
          role: Number(i.role),
          issuer: i.issuer,
          orgName: i.orgName,
          orgUrl: i.orgUrl,
        }))

      setIssuers(normalize(_issuers))
      setLegalAuthorities(normalize(_legal))
      setMediaEntities(normalize(_media))
    } catch (err) {
      console.log(err)
      setError('Failed to fetch authorities. Check contract or wallet.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthorities()
  }, [])

  const SectionCard = ({ title, icon: Icon, items }) => (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-xl mt-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center">
          <Icon className="text-indigo-400 w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>

      {items.length === 0 && (
        <p className="text-slate-400 text-sm">No entries found.</p>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl shadow-md"
          >
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-slate-300">Issuer:</span>{' '}
              {item.issuer}
            </p>

            <p className="text-sm text-slate-400">
              <span className="font-semibold text-slate-300">
                Organization:
              </span>{' '}
              {item.orgName}
            </p>

            <p className="text-sm text-slate-400">
              <span className="font-semibold text-slate-300">URL:</span>{' '}
              {item.orgUrl}
            </p>

            <p className="text-sm text-slate-400">
              <span className="font-semibold text-slate-300">Role:</span>{' '}
              {roleNames[item.role] || item.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          Registered Authorities
        </h1>

        <p className="text-slate-400 text-center mb-10">
          Click a category to view registered authorities.
        </p>

        {/* TABS */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab('issuers')}
            className={`px-5 py-2 rounded-xl border transition ${
              activeTab === 'issuers'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/60'
                : 'border-slate-700 text-slate-400 bg-slate-800/30'
            }`}
          >
            Certificate Issuers
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`px-5 py-2 rounded-xl border transition ${
              activeTab === 'legal'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/60'
                : 'border-slate-700 text-slate-400 bg-slate-800/30'
            }`}
          >
            Legal Authorities
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-5 py-2 rounded-xl border transition ${
              activeTab === 'media'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/60'
                : 'border-slate-700 text-slate-400 bg-slate-800/30'
            }`}
          >
            Media Entities
          </button>
        </div>

        {/* Loading + Error */}
        {loading && (
          <div className="flex items-center gap-2 text-indigo-400 mb-6 justify-center">
            <Loader className="animate-spin w-5 h-5" />
            Loading authorities...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-400 mb-6 justify-center">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* CONDITIONAL RENDERING */}
        {activeTab === 'issuers' && (
          <SectionCard
            title="Certificate Issuers"
            icon={ShieldCheck}
            items={issuers}
          />
        )}

        {activeTab === 'legal' && (
          <SectionCard
            title="Legal Authorities"
            icon={Landmark}
            items={legalAuthorities}
          />
        )}

        {activeTab === 'media' && (
          <SectionCard
            title="Media Entities"
            icon={Newspaper}
            items={mediaEntities}
          />
        )}
      </div>
    </div>
  )
}
