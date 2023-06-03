
import React, {
  useContext,
  useState,
  useEffect
} from 'react';
import { auth, } from '../utils/firebase'
import { getAuth, signInWithPopup, GithubAuthProvider, onAuthStateChanged } from "firebase/auth";

interface IContextProps {
  currentUser: any;
  setCurrentUser: any;
  signInWithGithub: any;
  githubToken: any;
  setGithubToken: any;
}

const AuthContext = React.createContext({} as IContextProps);

const provider = new GithubAuthProvider();

// This is just a wrapper so it looks cleaner when we use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// This is the actual provider for the auth context.
export function AuthProvider({ children }: any) {

  const [currentUser, setCurrentUser] = useState<any>();
  const [githubToken, setGithubToken] = useState<any>();

  async function signInWithGithub() {
    let signInResult;
    try {
      signInResult = await signInWithPopup(auth, provider);
    }
    catch (error) {
      alert(error);
      return;
    }

    const credential = GithubAuthProvider.credentialFromResult(signInResult);
    const token = credential?.accessToken;
    const user = signInResult.user;

    setCurrentUser(user);
    setGithubToken(token);
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    })

    return unsubscribe;
  }, [])

  const value = {
    currentUser,
    githubToken,
    setCurrentUser,
    signInWithGithub,
    setGithubToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
