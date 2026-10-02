export function importLocalData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)

        // Validate that the imported JSON contains expected FLAIRD keys
        const expectedKeys = [
          'flaird_users',
          'flaird_current_user',
          'flaird_library',
          'flaird_favorites',
          'flaird_ratings',
          'flaird_reviews',
          'flaird_comments',
          'flaird_likes',
          'flaird_activities',
          'flaird_theme',
          'flaird_notifications',
          'flaird_settings'
        ]

        const hasValidKeys = expectedKeys.some(key => data[key] !== undefined)

        if (!hasValidKeys) {
          reject(new Error('Invalid backup file: missing expected FLAIRD data keys'))
          return
        }

        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, value)
        })

        resolve(true)
      } catch (error) {
        reject(new Error('Failed to parse backup file: ' + error.message))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}