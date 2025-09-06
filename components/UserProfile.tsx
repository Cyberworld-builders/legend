'use client'

import { useAuth } from '@/lib/auth-context'

export default function UserProfile() {
  const { user, signOut } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <p className="text-gray-900">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <p className="text-sm text-gray-600 font-mono">{user.id}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Sign In
          </label>
          <p className="text-gray-900">
            {user.last_sign_in_at 
              ? new Date(user.last_sign_in_at).toLocaleString()
              : 'Never'
            }
          </p>
        </div>

        <button
          onClick={signOut}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
} 