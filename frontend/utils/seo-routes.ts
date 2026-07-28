export const siteUrl = 'https://pilorama-razbegaevo.clients.site'

export const indexableRoutes = [
  { loc: '/', changefreq: 'weekly' as const, priority: 1 as const },
  { loc: '/pilomaterialy', changefreq: 'weekly' as const, priority: 0.9 as const },
  { loc: '/dostavka', changefreq: 'monthly' as const, priority: 0.7 as const },
  { loc: '/kontakty', changefreq: 'monthly' as const, priority: 0.8 as const },
  { loc: '/otzyvy', changefreq: 'weekly' as const, priority: 0.8 as const },
]
