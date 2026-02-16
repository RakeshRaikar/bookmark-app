// 'use client'

// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabaseClient'
// import { useRouter } from 'next/navigation'

// export default function Dashboard() {
//   const [bookmarks, setBookmarks] = useState<any[]>([])
//   const [title, setTitle] = useState('')
//   const [url, setUrl] = useState('')
//   const [user, setUser] = useState<any>(null)

//   const router = useRouter()

//   // 🔐 Get logged-in user
//   useEffect(() => {
//     const getUser = async () => {
//       const { data } = await supabase.auth.getUser()
//       if (!data.user) {
//         router.push('/')
//       } else {
//         console.log("Logged in user ID:", data.user.id) // 👈 ADD THIS
//         setUser(data.user)
//       }
//     }
//     getUser()
//   }, [])



//   // ➕ Add bookmark
//   const addBookmark = async () => {
//     if (!title || !url) return

//     await supabase.from('bookmarks').insert([
//       {
//         title,
//         url,
//         user_id: user.id,
//       },
//     ])

//     setTitle('')
//     setUrl('')
//   }

//   // ❌ Delete bookmark
//  const deleteBookmark = async (id: string) => {
//   const { error } = await supabase
//     .from('bookmarks')
//     .delete()
//     .eq('id', id)

//   if (!error) {
//     setBookmarks((prev) => prev.filter((b) => b.id !== id))
//   } else {
//     console.error(error)
//   }
// }



//   // 📡 Real-time subscription
//   useEffect(() => {
//     if (!user) return

//     const fetchBookmarks = async () => {
//     const { data, error } = await supabase
//       .from('bookmarks')
//       .select('*')
//       .eq('user_id', user.id)
//       .order('created_at', { ascending: false })

//     if (error) {
//       console.error(error)
//     } else {
//       setBookmarks(data || [])
//     }
//   }
//     fetchBookmarks()

//     const channel = supabase
//       .channel('bookmarks-channel')
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'bookmarks',
//           filter: `user_id=eq.${user?.id}`
//         },
//         () => {
//           fetchBookmarks()
//         }
//       )
//       .subscribe()

//     return () => {
//       supabase.removeChannel(channel)
//     }
//   }, [user])

//   return (
//     <div className="p-10 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>

//       <div className="flex flex-col gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="URL"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <button
//           onClick={addBookmark}
//           className="bg-black text-white p-2 rounded"
//         >
//           Add Bookmark
//         </button>
//       </div>

//       <ul className="space-y-3">
//         {bookmarks.map((bookmark) => (
//           <li
//             key={bookmark.id}
//             className="flex justify-between items-center border p-3 rounded"
//           >
//             <a href={bookmark.url} target="_blank">
//               {bookmark.title}
//             </a>
//             <button
//               onClick={() => deleteBookmark(bookmark.id)}
//               className="text-red-500"
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }



'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState<any>(null)

  const router = useRouter()

  // ✅ Proper session check (IMPORTANT)
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
      } else {
        setUser(session.user)
      }
    }

    getSession()
  }, [router])

  // ➕ Add bookmark
  const addBookmark = async () => {
    if (!title || !url || !user) return

    const { error } = await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])

    if (!error) {
      setTitle('')
      setUrl('')
    }
  }

  // ❌ Delete bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (!error) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    }
  }

  // 📡 Fetch + Realtime
  useEffect(() => {
    if (!user) return

    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setBookmarks(data || [])
    }

    fetchBookmarks()

    const channel = supabase
      .channel('bookmarks-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`
        },
        fetchBookmarks
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>

      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={addBookmark}
          className="bg-black text-white p-2 rounded"
        >
          Add Bookmark
        </button>
      </div>

      <ul className="space-y-3">
        {bookmarks.map((bookmark) => (
          <li
            key={bookmark.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <a href={bookmark.url} target="_blank">
              {bookmark.title}
            </a>
            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
