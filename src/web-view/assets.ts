export type Assets = {
  audio: {[name in 'dice0']: ArrayBuffer}
  img: {
    [name in 'checkerboard' | 'cursor' | 'dice' | 'hpOrb']: HTMLImageElement
  }
}

export async function Assets(): Promise<Assets> {
  const [dice0, checkerboard, cursor, dice, hpOrb] = await Promise.all([
    loadAudio('assets/audio/dice-0.ogg'),
    loadImage('assets/images/checkerboard.webp'),
    loadImage('assets/images/cursor.webp'),
    loadImage('assets/images/dice.webp'),
    loadImage('assets/images/hp-orb.webp')
    // await document.fonts.load('6px mem 5x6')
  ])
  return {audio: {dice0}, img: {checkerboard, cursor, dice, hpOrb}}
}

async function loadAudio(url: string): Promise<ArrayBuffer> {
  const rsp = await fetch(url)
  if (!rsp.ok) throw Error(`HTTP error ${rsp.status}: ${rsp.statusText}`)
  return await rsp.arrayBuffer()
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(img)
    img.src = src
  })
}

// export async function loadSnoovatar(
//   assets: Readonly<Assets>,
//   player: {snoovatarURL: string; t2: T2}
// ): Promise<HTMLImageElement> {
//   return player.t2 === noT2
//     ? assets.anonSnoovatar
//     : loadImage(player.snoovatarURL)
// }
