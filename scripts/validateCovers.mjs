import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const BASE = join(__dirname, '..')

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function extractTitles(filePath) {
  const content = readFileSync(filePath, 'utf-8')

  const regex =
    /title:\s*"((?:\\.|[^"\\])*)"|title:\s*'((?:\\.|[^'\\])*)'/g

  const titles = []
  let match

  while ((match = regex.exec(content)) !== null) {
    const rawTitle = match[1] ?? match[2]
    const title = rawTitle.replace(/\\(['"\\])/g, '$1')
    titles.push(title)
  }

  return titles
}

function listCoverFiles(dir) {
  return readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
}

function extractCoverMap(content, mapName) {
  const blockRegex = new RegExp(`(const ${mapName} = \\{[\\s\\S]*?\\n\\})`)
  const blockMatch = content.match(blockRegex)
  if (!blockMatch) return {}

  try {
    const factory = new Function(`${blockMatch[1]}; return ${mapName}`)
    return factory()
  } catch {
    return {}
  }
}

function validate(label, dataFile, coverDir, coverMapContent, mapName) {
  const titles = extractTitles(dataFile)
  const files = listCoverFiles(coverDir)
  const coverMap = extractCoverMap(coverMapContent, mapName)

  const normalizedFiles = new Set(
    files.map(f => normalizeName(f.replace(/\.\w+$/, '')))
  )

  const missing = []
  for (const title of titles) {
    const mappedFilename = coverMap[title]
    const inMap = mappedFilename && files.includes(mappedFilename)
    const byNormalization = normalizedFiles.has(normalizeName(title))

    if (!inMap && !byNormalization) {
      missing.push(title)
    }
  }

  if (missing.length > 0) {
    console.error(`\n[${label}] Missing covers for ${missing.length} title(s):`)
    missing.forEach(t => console.error(`  - ${t}`))
    return false
  }

  console.log(`[${label}] All ${titles.length} titles have covers.`)
  return true
}

const mediaCoversPath = join(BASE, 'src/utils/mediaCovers.js')
const mediaCoversContent = readFileSync(mediaCoversPath, 'utf-8')

const animeOk = validate(
  'anime',
  join(BASE, 'src/data/anime.js'),
  join(BASE, 'src/assets/AnimeCover'),
  mediaCoversContent,
  'animeCoverMap'
)

const mangaOk = validate(
  'manga',
  join(BASE, 'src/data/manga.js'),
  join(BASE, 'src/assets/MangaCover'),
  mediaCoversContent,
  'mangaCoverMap'
)

if (!animeOk || !mangaOk) {
  console.error('\nError: Some media are missing cover images. Add the cover file or update the title.')
  process.exit(1)
}

console.log('\nAll covers validated successfully.')
process.exit(0)
