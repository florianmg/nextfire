import { useEffect, useState } from 'react'

import { useAuthState } from 'react-firebase-hooks/auth'
import { firestore, auth } from '../lib/firebase'

export const useUserData = () => {
  const [username, setUsername] = useState(null)
  const [user] = useAuthState(auth)

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe

    if (user) {
      const ref = firestore.collection('users').doc(user.uid)
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username)
      })
    } else {
      setUsername(null)
    }

    return unsubscribe
  }, [user])

  return { user, username }
}
