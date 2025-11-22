'use client'

import Link from 'next/link'
import Navbar from './Navbar'
import { Upload, FileCheck, Shield, Scale, Eye, UserPlus } from 'lucide-react'

export default function Dashboard() {
  const actions = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: 'Upload Digital Asset',
      description:
        'Upload certificates, legal documents, or media files to the blockchain',
      href: '/upload',
      color: 'from-indigo-600 to-indigo-800',
    },
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: 'Register Issuer',
      description:
        'Register as a trusted certificate issuer or legal authority',
      href: '/registerissue',
      color: 'from-sky-600 to-sky-800',
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: 'Issue Certificate',
      description: 'Issue verified certificates to students or organizations',
      href: '/issue',
      color: 'from-purple-600 to-purple-800',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Validate Certificate',
      description: 'Verify the authenticity of any uploaded certificate',
      href: '/validate',
      color: 'from-emerald-600 to-emerald-800',
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'View Legal Document',
      description: 'Access and verify legal documents stored on blockchain',
      href: '/viewlegaldoc',
      color: 'from-orange-600 to-orange-800',
    },
    {
      icon: <Scale className="w-8 h-8" />,
      title: 'Authority Panel',
      description: 'Manage registered authorities',
      href: '/authoritiesregister',
      color: 'from-pink-600 to-pink-800',
    },
    {
      icon: <Scale className="w-8 h-8" />,
      title: 'Hash Details',
      description: 'Get hash timestamp, who registered it and its category',
      href: '/gethashdetails',
      color: 'from-pink-600 to-pink-800',
    },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Verification Dashboard
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Manage your documents, certificates, and verification processes from
            one central hub
          </p>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                ></div>

                {/* Content */}
                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-linear-to-br ${action.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition">
                    {action.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {action.description}
                  </p>

                  {/* Arrow Icon */}
                  <div className="mt-4 flex items-center text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Access</span>
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">1,234</div>
              <div className="text-slate-400 text-sm">Documents Verified</div>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">567</div>
              <div className="text-slate-400 text-sm">Certificates Issued</div>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">89</div>
              <div className="text-slate-400 text-sm">Trusted Issuers</div>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-slate-400 text-sm">Verification Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
