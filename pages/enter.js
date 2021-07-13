import { useContext, useState, useCallback, useEffect } from 'react'
import debounce from 'lodash.debounce'
import { UserContext } from '../lib/context'
import { auth, firestore, googleAuthProvider } from '../lib/firebase'

export default function Enter() {
  const { user, username } = useContext(UserContext)

  return (
    <main>
      <h1>Enter page</h1>
      {user ? (
        !username ? (
          <UsernameForm username={username} />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  )
}

const SignInButton = () => {
  const handleClick = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider)
    } catch (e) {
      console.error(`message error : ${e}`)
    }
  }
  return <button onClick={handleClick}>Sign in</button>
}

const SignOutButton = () => {
  return <button onClick={() => auth.signOut()}>Sign out</button>
}

const UsernameForm = () => {
  const { user, username } = useContext(UserContext)
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`)
    const usernameDoc = firestore.doc(`usernames/${formValue}`)

    // Commit both docs together as a batch write.
    const batch = firestore.batch()
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    })
    batch.set(usernameDoc, { uid: user.uid })

    await batch.commit()
  }
  const handeChangeInput = (e) => {
    const val = e.target.value.toLowerCase()
    const validUsername = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }
    if (validUsername.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }
  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`)
        const { exists } = await ref.get()
        console.log('Firestore read executed!')
        setIsValid(!exists)
        setLoading(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  if (username) return
  return (
    <section>
      <h3>Choose a unique username</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="myname"
          type="text"
          onChange={handeChangeInput}
          value={formValue}
        />
        <UsernameMessage
          username={username}
          isValid={isValid}
          loading={loading}
        />
        <button
          className="btn-green"
          type="submit"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Choose
        </button>
      </form>
    </section>
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>
  } else {
    return <p></p>
  }
}
