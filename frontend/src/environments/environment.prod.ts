export const environment = {
  production: true,
  menus: [
    {
      name: 'Program',
      route: '/program',
      icon: 'far fa-file-alt',
      visible: true,
      active: false
    },
    {
      name: 'Profile',
      route: '/profile',
      icon: 'far fa-user-circle',
      visible: true,
      active: true
    },
    {
      name: 'Fleet Control',
      route: '/fleet',
      icon: 'fas fa-wrench',
      visible: true,
      active: false
    },
    {
      name: 'Material Inventory',
      route: '/material',
      icon: 'fas fa-dolly-flatbed',
      visible: true,
      active: false
    },
    {
      name: 'Insight',
      route: '/insight',
      icon: 'far fa-chart-bar',
      visible: true,
      active: false,
    },
    {
      name: 'Setting',
      route: '/setting',
      icon: 'fas fa-cogs',
      visible: true,
      active: false,
    }
  ],
  extendedmenu: [
    { needsapproval: false, enabled: true, active: false, name: 'Dashboard', icon: 'fa-tachometer', path: '/dashboard' },
    { needsapproval: false, enabled: true, active: false, name: 'Appointments', icon: 'fa-calendar-check-o', path: '/appointment' }
  ],
  apiBaseUrl: 'http://3diligent-dms-service-dev.7gzpdma3ia.us-west-2.elasticbeanstalk.com'
};
