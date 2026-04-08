'use client'
import { useCallback } from 'react'
import { doc, updateDoc, addDoc, collection, increment, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const TOKEN_COSTS = {
  single_export: 1,
  bulk_export: 3,
  custom_size: 2,
  advanced_edit: 2,
}

export function useTokens(user) {
  const deductTokens = useCallback(async (reason, cost) => {
    if (!user?.uid) throw new Error('Not authenticated')
    if ((user.tokenBalance ?? 0) < cost) throw new Error('Insufficient tokens')
    await updateDoc(doc(db, 'users', user.uid), {
      tokenBalance: increment(-cost),
    })
    await addDoc(collection(db, 'token_transactions'), {
      uid: user.uid,
      type: 'debit',
      amount: cost,
      reason,
      createdAt: serverTimestamp(),
    })
  }, [user])

  const hasTokens = useCallback((cost) => {
    return (user?.tokenBalance ?? 0) >= cost
  }, [user])

  return { deductTokens, hasTokens, balance: user?.tokenBalance ?? 0 }
}
