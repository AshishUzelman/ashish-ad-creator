const API_KEY = process.env.NEXT_PUBLIC_STITCH_API_KEY

export async function generateAdLayout(prompt, width, height) {
  if (!API_KEY) throw new Error('STITCH_API_KEY not set in .env.local')
  const { stitch } = await import('@google/stitch-sdk')
  stitch.configure({ apiKey: API_KEY })
  const project = await stitch.createProject(`Ad Creator — ${Date.now()}`)
  const fullPrompt = `Ad creative design: ${prompt}. Size: ${width}x${height}px. Dark background. High contrast text. Professional marketing visual.`
  const screen = await project.generateScreenFromText(fullPrompt)
  const imageUrl = await screen.getImage()
  return imageUrl
}
