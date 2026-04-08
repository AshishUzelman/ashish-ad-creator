import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function createProject(uid, name) {
  return addDoc(collection(db, 'projects'), {
    uid,
    name,
    status: 'draft',
    thumbnail: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function subscribeToProjects(uid, callback) {
  const q = query(
    collection(db, 'projects'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(projects)
  })
}
