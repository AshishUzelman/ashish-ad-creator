import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
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

export async function getProject(projectId) {
  const snap = await getDoc(doc(db, 'projects', projectId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function updateProjectCanvas(projectId, canvasJson) {
  await updateDoc(doc(db, 'projects', projectId), {
    canvasJson,
    updatedAt: serverTimestamp(),
  })
}

export async function saveExport(projectId, { url, format, width, height }) {
  await updateDoc(doc(db, 'projects', projectId), {
    exports: arrayUnion({ url, format, width, height, exportedAt: Date.now() }),
    updatedAt: serverTimestamp(),
  })
}
