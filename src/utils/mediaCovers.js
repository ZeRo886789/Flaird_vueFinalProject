const animeFiles = import.meta.glob(
  '../assets/AnimeCover/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' }
)

const mangaFiles = import.meta.glob(
  '../assets/MangaCover/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' }
)

function createCoverMap(files) {
  return Object.fromEntries(
    Object.entries(files).map(([path, url]) => {
      const filename = path.split('/').pop()
      return [filename, url]
    })
  )
}

export const animeCovers = createCoverMap(animeFiles)
export const mangaCovers = createCoverMap(mangaFiles)

export function getAnimeCover(filename) {
  return animeCovers[filename] || ''
}

export function getMangaCover(filename) {
  return mangaCovers[filename] || ''
}

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function findCoverByNormalizedTitle(covers, title) {
  const normalizedTitle = normalizeName(title.replace(/\.\w+$/, ''))
  for (const filename of Object.keys(covers)) {
    if (normalizeName(filename.replace(/\.\w+$/, '')) === normalizedTitle) {
      return covers[filename]
    }
  }
  return null
}

function resolveCoverFromMap(covers, coverMap, title) {
  const filename = coverMap[title]
  if (filename && covers[filename]) {
    return covers[filename]
  }
  return findCoverByNormalizedTitle(covers, title) || ''
}

const animeCoverMap = {
  'Solo Leveling': 'Solo Leveling.jpg',
  'Demon Slayer': 'Demon Slayer.jpg',
  'Demon Slayer: Kimetsu no Yaiba': 'Demon Slayer kimetsu no Yaiba.jpg',
  'Attack on Titan': 'Attack on Titan.jpg',
  'Jujutsu Kaisen': 'Jujutso Kaisen.jpg',
  'One Piece': 'One Peice.jpg',
  'My Hero Academia': 'My Hero Academia.jpg',
  'Fullmetal Alchemist: Brotherhood': "Fullmetal Alchemist'.jpg",
  'Spy x Family': 'SpyXfamily.jpg',
  'Chainsaw Man': 'Chainsaw Man.jpg',
  'Beastars': 'Beastars.jpg',
  'Monster': 'Monster.jpg',
  'A Silent Voice': 'A silent voice.jpg',
  'Redo Healer': 'Redo Healer.jpg',
  'Re:Zero': 'ReZero.jpg',
  'Cowboy Bebop': 'Cowboy Bebop.jpg',
  'Death Note': 'Death Note.jpg',
  'Dorohedoro': 'Dorohedoro.jpg',
  'Dr. Stone': 'Dr. Stone.jpg',
  "Frieren: Beyond Journey's End": 'Frieren.jpg',
  'Ghost in the Shell: Stand Alone Control': 'Ghost in the Shell Stand Alone Complex.jpg',
  'Ghost in the Shell: Stand Alone Complex': 'Ghost in the Shell Stand Alone Complex.jpg',
  'Hunter x Hunter': 'Hunter x Hunter.jpg',
  'Neon Genesis Evangelion': 'Neon Genesis Evangelion.jpg',
  'Neon Genesis Evangelion: 3.0+1.0': 'Neon Genesis Evangelion.jpg',
  'Kaguya-sama: Love is War': 'Kaguya sama Love is War.jpg',
  'Mob Psycho 100': 'Mob Psycho 100.jpg',
  'Mushoku Tensei': 'Mushoku Tensei.jpg',
  'Spirited Away': 'Spirited Away.jpg',
  'That Time I Got Reincarnated as a Slime': 'That Time I Got Reincarnated as a Slime.jpg',
  'Violet Evergarden': 'Violet Evergarden.jpg',
  'Your Name': 'Your name.jpg'
}

const mangaCoverMap = {
  'The Stellar Swordmaster': 'The Stellar Swordmaster.jpg',
  'Absolute Regression': 'Absolute Regression.jpg',
  'Pick Me Up': 'Pick Me Up.jpg',
  'Myst, Might, Mayhem': 'Myst, Might, Mayhem.jpg',
  'The Patron of Villains': 'The Patron of Villains.jpg',
  'Chronicles of the Demon Faction': 'Chronicles of the Demon Faction.jpg',
  'The Infinite Mage': 'The Infinite Mage.jpg',
  'The Breaker': 'The Breaker.jpg',
  "Girls of the Wild's": "Girls of the Wild's.jpg",
  "Omniscient Reader's Viewpoint": "Omniscient Reader's Viewpoint.jpg",
  'The Beginning After the End': 'The Beginning After the End.jpg',
  'Solo Leveling': 'Solo Leveling.jpg',
  'The Greatest Estate Developer': 'The Greatest Estate Developer.jpg',
  "The Swordmaster's Son": "The Swordmaster's Son.jpg",
  'One Piece': 'One Piece.jpg',
  'Chainsaw Man': 'Chainsaw Man.jpg',
  'Jujutsu Kaisen': 'Jujutsu Kaisen.jpg',
  'Jujutsu Kaisen 0': 'Jujutsu Kaisen 0.jpg',
  'Demon Slayer': 'Demon Slayer.jpg',
  'My Hero Academia': 'My Hero Academia.jpg',
  'Fullmetal Alchemist': 'Fullmetal Alchemist.jpg',
  'Spy x Family': 'Spy x Family.jpg',
  'How to Fight': 'HowToFight.jpg',
  'Lookism': 'Lookism.jpg',
  'My Land Lady Noona': 'MyLandLadyNoona.jpg',
  'One Day, Suddenly, Seoul Is': 'One Day, Suddenly, Seoul Is.jpg',
  'Reality Quest': 'Reality quest.jpg',
  'Berserk': 'Berserk.jpg',
  'Sweet Home': 'Sweet Home.jpg',
  "The Scholar's Reincarnation": "The Scholar's Reincarnation.jpg",
  'Vinland Saga': 'Vinland Saga.jpg',
  'Mushishi': 'Mushishi.jpg',
  'Nana': 'Nana.jpg',
  '20th Century Boys': '20th Century Boys.jpg',
  'Beastars': 'Beastars.jpg',
  'Attack on Titan': 'Attack on Titan.jpg',
  'Monster': 'Monster.jpg'
}

export function resolveAnimeCover(title) {
  return resolveCoverFromMap(animeCovers, animeCoverMap, title)
}

export function resolveMangaCover(title) {
  return resolveCoverFromMap(mangaCovers, mangaCoverMap, title)
}

export function resolveCover(type, title) {
  if (type === 'anime') return resolveAnimeCover(title)
  if (type === 'manga') return resolveMangaCover(title)
  return ''
}
