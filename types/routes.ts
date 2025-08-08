export type RouteConfig = {
  path: string
  roles: string[]
  desktopLabel: string
  mobileLabel: string
  desktopDisplay: boolean
  mobileDisplay: boolean
  footerDisplay: boolean
}

export const protectedRoutes: Record<string, RouteConfig> = {
  experience: {
    path: '/experience',
    roles: [],
    desktopLabel: 'experience',
    mobileLabel: 'Experience',
    desktopDisplay: false,
    mobileDisplay: true,
    footerDisplay: true,
  },
  projects: {
    path: '/projects',
    roles: [],
    desktopLabel: 'Projects',
    mobileLabel: 'Projects',
    desktopDisplay: false,
    mobileDisplay: true,
    footerDisplay: true,
  },
  about: {
    path: '/about',
    roles: [],
    desktopLabel: 'About',
    mobileLabel: 'About Me',
    desktopDisplay: false,
    mobileDisplay: true,
    footerDisplay: true,
  },
  contact: {
    path: '/contact',
    roles: [],
    desktopLabel: 'Contact',
    mobileLabel: 'Contact Me',
    desktopDisplay: false,
    mobileDisplay: true,
    footerDisplay: true,
  }
}
