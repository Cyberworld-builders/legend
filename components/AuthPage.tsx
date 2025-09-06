'use client'

import { useState } from 'react'
import AuthForm from './AuthForm'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Welcome to Legend
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <AuthForm 
          mode={mode} 
          onSuccess={() => {
            // You can add navigation logic here
            console.log('Authentication successful')
          }}
        />

        <div className="text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
    </div>
  )
} 