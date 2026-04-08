import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export async function uploadExport(uid, projectId, blob, format) {
  const filename = `exports/${uid}/${projectId}/${Date.now()}.${format}`
  const storageRef = ref(storage, filename)
  await uploadBytes(storageRef, blob, { contentType: `image/${format}` })
  return getDownloadURL(storageRef)
}

export async function uploadImage(uid, file) {
  const ext = file.name.split('.').pop()
  const filename = `uploads/${uid}/${Date.now()}.${ext}`
  const storageRef = ref(storage, filename)
  await uploadBytes(storageRef, file, { contentType: file.type })
  return getDownloadURL(storageRef)
}
