import { useState } from 'react'

import {
  Shield,
  FileCheck,
  Scale,
  Newspaper,
  ChevronRight,
  Upload,
  CheckCircle,
  Users,
  Lock,
  Globe,
  Zap,
} from 'lucide-react'
export default function RoleCardsSection() {
  const roles = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Platform Admin',
      description:
        'Manage the platform, register trusted issuers, and oversee the verification ecosystem. Full access to system administration and governance.',
      color: 'from-indigo-600 to-indigo-800',
    },
    {
      icon: <FileCheck className="w-12 h-12" />,
      title: 'Certificate Issuer',
      description:
        'Educational institutions and organizations authorized to issue verifiable certificates. Create immutable credential records on blockchain.',
      color: 'from-sky-600 to-sky-800',
    },
    {
      icon: <Scale className="w-12 h-12" />,
      title: 'Legal Authority',
      description:
        'Government agencies and legal entities that verify and validate legal documents. Maintain authoritative records of legal authenticity.',
      color: 'from-purple-600 to-purple-800',
    },
    {
      icon: <Newspaper className="w-12 h-12" />,
      title: 'Media Agency',
      description:
        'News organizations and content creators who verify media authenticity. Combat misinformation through verified content tracking.',
      color: 'from-emerald-600 to-emerald-800',
    },
  ]

  return (
    <section id="roles" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ecosystem Participants
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Different roles working together to maintain a trusted verification
            network
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, idx) => (
            <div
              key={idx}
              className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              ></div>

              <div className="relative">
                <div
                  className={`w-20 h-20 bg-linear-to-br ${role.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
                >
                  {role.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {role.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
