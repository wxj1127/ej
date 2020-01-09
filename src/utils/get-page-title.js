import defaultSettings from '@/settings'

const title = defaultSettings.title || '家政预约'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
