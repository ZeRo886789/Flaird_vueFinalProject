export const filterByGenre = (items, genre) => genre === 'all' ? items : items.filter(x => x.genres?.includes(genre))
