'use client'
import { useState, useEffect, useRef } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

async function ensureUserDoc(firebaseUser) {
  const ref = doc(db, 'users', firebaseUser.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role: 'free',
      tokenBalance: 5,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const unsubDocRef = useRef(null)

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up previous Firestore listener
      if (unsubDocRef.current) {
        unsubDocRef.current()
        unsubDocRef.current = null
      }

      if (firebaseUser) {
        await ensureUserDoc(firebaseUser)
        // Real-time listener on users/{uid} — merges Firestore fields into user object
        const ref = doc(db, 'users', firebaseUser.uid)
        unsubDocRef.current = onSnapshot(ref, (snap) => {
          const firestoreData = snap.exists() ? snap.data() : {}
          setUser({ ...firebaseUser, ...firestoreData })
          setLoading(false)
        })
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      unsubAuth()
      if (unsubDocRef.current) unsubDocRef.current()
    }
  }, [])

  async function signIn() {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  return { user, loading, signIn, signOut }
}
