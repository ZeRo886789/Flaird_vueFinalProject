import { resolveCover } from '../utils/mediaCovers'

export const releases = [
  {
    id: 1,
    titleId: 2,
    date: '2026-10-02',
    time: '20:00',
    title: 'Frieren: Beyond Journey\'s End',
    type: 'anime',
    episode: 28,
    cover: resolveCover('anime', 'Frieren: Beyond Journey\'s End'),
    status: 'Today'
  },
  {
    id: 2,
    titleId: 6,
    date: '2026-10-02',
    time: '23:30',
    title: 'One Piece',
    type: 'anime',
    episode: 1150,
    cover: resolveCover('anime', 'One Piece'),
    status: 'Today'
  },
  {
    id: 3,
    titleId: 5,
    date: '2026-10-03',
    time: '18:30',
    title: 'Jujutsu Kaisen',
    type: 'anime',
    episode: 48,
    cover: resolveCover('anime', 'Jujutsu Kaisen'),
    status: 'Tomorrow'
  },
  {
    id: 4,
    titleId: 1,
    date: '2026-10-03',
    time: '21:00',
    title: 'Solo Leveling',
    type: 'anime',
    episode: 26,
    cover: resolveCover('anime', 'Solo Leveling'),
    status: 'Tomorrow'
  },
  {
    id: 5,
    titleId: 3,
    date: '2026-10-05',
    time: '19:00',
    title: 'Demon Slayer',
    type: 'anime',
    episode: 64,
    cover: resolveCover('anime', 'Demon Slayer'),
    status: 'This Week'
  },
  {
    id: 6,
    titleId: 4,
    date: '2026-10-06',
    time: '20:00',
    title: 'Attack on Titan',
    type: 'anime',
    episode: 90,
    cover: resolveCover('anime', 'Attack on Titan'),
    status: 'This Week'
  },
  {
    id: 7,
    titleId: 110,
    date: '2026-10-07',
    time: '18:00',
    title: 'Omniscient Reader\'s Viewpoint',
    type: 'manga',
    chapter: 221,
    cover: resolveCover('manga', "Omniscient Reader's Viewpoint"),
    status: 'This Week'
  },
  {
    id: 8,
    titleId: 111,
    date: '2026-10-08',
    time: '19:00',
    title: 'The Beginning After the End',
    type: 'manga',
    chapter: 211,
    cover: resolveCover('manga', 'The Beginning After the End'),
    status: 'This Week'
  },
  {
    id: 9,
    titleId: 14,
    date: '2026-10-12',
    time: '20:00',
    title: 'Spy x Family',
    type: 'anime',
    episode: 38,
    cover: resolveCover('anime', 'Spy x Family'),
    status: 'Later'
  },
  {
    id: 10,
    titleId: 112,
    date: '2026-10-15',
    time: '18:00',
    title: 'Solo Leveling',
    type: 'manga',
    chapter: 179,
    cover: resolveCover('manga', 'Solo Leveling'),
    status: 'Later'
  }
]
