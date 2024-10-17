export const getTimeDifference = (date) => {
  const diff = new Date() - new Date(date)

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(weeks / 30)
  const years = Math.floor(months / 365)

  switch (true) {
    case seconds < 60:
      return `${seconds} seconds ago`
    case minutes < 60:
      return `${minutes} minutes ago`
    case hours < 24:
      return `${hours} hours ago`
    case days < 7:
      return `${days} days ago`
    case weeks < 4:
      return `${weeks} weeks ago`
    case months < 12:
      return `${months} months ago`
    default:
      return `${years} years ago`
  }
}
