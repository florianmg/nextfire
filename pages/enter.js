import { auth, googleAuthProvider } from '../lib/firebase'

export default function Enter() {
  const user = null
  const username = null

  return (
    <main>
      <h1>Enter page</h1>
      {user ? (
        !username ? (
          <UsernameForm />
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
  return (
    <div>
      <p>username</p>
      <input type="text" />
    </div>
  )
}
