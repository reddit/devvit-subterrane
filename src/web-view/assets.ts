export type Assets = {
  audio: {[name in 'dice0']: ArrayBuffer}
  font: FontFace
  img: {
    [name in
      | 'checkerboard'
      | 'cursor'
      | 'dice'
      | 'fog'
      | 'hpOrb'
      | 'logo'
      | 'loot'
      | 'monster']: HTMLImageElement
  }
}

export async function Assets(): Promise<Assets> {
  const [
    dice0,
    checkerboard,
    cursor,
    dice,
    fog,
    hpOrb,
    logo,
    loot,
    monster,
    font
  ] = await Promise.all([
    loadAudio('assets/audio/dice-0.ogg'),
    loadImage('assets/images/checkerboard.webp'),
    loadImage('assets/images/cursor.webp'),
    loadImage('assets/images/dice.webp'),
    loadImage('assets/images/fog.webp'),
    loadImage('assets/images/hp-orb.webp'),
    loadImage('assets/images/logo.webp'),
    loadImage('assets/images/loot.webp'),
    loadImage('assets/images/monster.webp'),
    new FontFace('mem', 'url(assets/mem-prop-5x6.ttf)').load()
  ])

  return {
    audio: {dice0},
    font,
    img: {checkerboard, cursor, dice, fog, hpOrb, logo, loot, monster}
  }
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
