/**
 * Security Demo - Compare different approaches used by major companies
 */

import React, { useState } from 'react'
import { EnterprisePasswordSecurity, ProductionSecurity } from '@/shared/utils/enterprise-security'

export const SecurityDemo = () => {
  const [email] = useState('demo@example.com')
  const [password] = useState('DemoPassword123!')
  const [selectedMethod, setSelectedMethod] = useState('standard')

  const demonstrateMethod = (method: string) => {
    let _payload: any
    let _company = ''
    let _description = ''

    switch (method) {
      case 'standard':
        _payload = EnterprisePasswordSecurity.createSecureLoginPayload_Standard(email, password)
        _company = 'Facebook/Google/Netflix'
        _description =
          'Standard approach - password visible in Network tab, focus on backend security'
        break
      case 'fingerprinting':
        _payload = EnterprisePasswordSecurity.createSecureLoginPayload_WithFingerprinting(
          email,
          password
        )
        _company = 'GitHub/LinkedIn'
        _description = 'Add device fingerprinting for additional security'
        break
      case 'banking':
        _payload = EnterprisePasswordSecurity.createSecureLoginPayload_Banking(email, password)
        _company = 'Banks/Financial'
        _description = 'Multiple security layers with risk assessment'
        break
      case 'advanced':
        _payload = EnterprisePasswordSecurity.createSecureLoginPayload_Advanced(email, password)
        _company = 'Your App (Advanced)'
        _description = 'Advanced obfuscation - better than major companies for Network tab'
        break
      default:
        return
    }

    // console.group(`🔐 ${company} Approach`)
    // console.log('Description:', description)
    // console.log('Network Tab Payload:', payload)
    // console.log(
    //   'Password visible in Network tab:',
    //   method === 'standard' ? '✅ YES (normal)' : '❌ NO (obfuscated)'
    // )
    // console.groupEnd()
  }

  React.useEffect(() => {
    ProductionSecurity.explainSecurityReality()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🔐 Password Security: How Major Companies Handle It
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">Reality Check</h2>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Facebook</strong>: Password visible in Network tab
            </li>
            <li>
              ✅ <strong>Google</strong>: Password visible in Network tab
            </li>
            <li>
              ✅ <strong>Netflix</strong>: Password visible in Network tab
            </li>
            <li>
              ✅ <strong>GitHub</strong>: Password visible in Network tab
            </li>
            <li>
              ✅ <strong>LinkedIn</strong>: Password visible in Network tab
            </li>
          </ul>
          <p className="mt-3 text-xs text-blue-600">
            This is normal browser behavior that cannot be changed!
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-green-800">What They Focus On</h2>
          <ul className="space-y-2 text-sm">
            <li>🔒 HTTPS encryption</li>
            <li>🔒 Strong password hashing (bcrypt)</li>
            <li>🔒 Rate limiting & brute force protection</li>
            <li>🔒 Two-factor authentication</li>
            <li>🔒 Device verification</li>
            <li>🔒 Session security</li>
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Demo: Different Security Approaches</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'standard', label: 'Facebook/Google', color: 'blue' },
            { key: 'fingerprinting', label: 'GitHub', color: 'purple' },
            { key: 'banking', label: 'Banking', color: 'green' },
            { key: 'advanced', label: 'Your App', color: 'orange' },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => {
                setSelectedMethod(key)
                demonstrateMethod(key)
              }}
              className={`px-4 py-2 rounded text-white font-semibold transition-colors duration-200 ${
                selectedMethod === key ? `bg-${color}-600` : `bg-${color}-400 hover:bg-${color}-500`
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">Current Demo: {email}</h3>
        <div className="text-xs bg-white p-2 rounded border">
          <strong>Instructions:</strong>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Open Browser Console (F12 &rarr; Console tab)</li>
            <li>Click the buttons above</li>
            <li>See how each company handles password security</li>
            <li>Check Network tab to see the actual requests</li>
          </ol>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">🎯 Key Takeaway</h3>
        <p className="text-sm text-yellow-700">
          <strong>Major companies accept that passwords are visible in Network tab</strong> because:
        </p>
        <ul className="mt-2 text-sm text-yellow-700 space-y-1">
          <li>&bull; It&apos;s impossible to prevent (browser architecture limitation)</li>
          <li>&bull; Real security happens on the backend with HTTPS + proper hashing</li>
          <li>&bull; Attackers don&apos;t need Network tab - they have much easier methods</li>
          <li>&bull; Focus on protection that actually matters: 2FA, rate limiting, etc.</li>
        </ul>
      </div>
    </div>
  )
}

export default SecurityDemo
