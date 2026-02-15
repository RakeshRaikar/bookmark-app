'use client'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
       options: {
      redirectTo: 'http://localhost:3000/dashboard'
       }
    })
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <button 
        onClick={login}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Login with Google
      </button>
    </div>
  )
}

