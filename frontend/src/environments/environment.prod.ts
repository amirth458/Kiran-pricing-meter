export const environment = {
  production: true,
  menus: [
    {
      name: 'Program',
      route: '/program',
      icon: 'far fa-file-alt',
      visible: true,
      active: true
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
    },
    {
      name: 'Design',
      route: '/design',
      icon: 'far fa-edit',
      visible: true,
      active: false
    },
  ],
  admin_menus: [
  ],
  extendedmenu: [
    { needsapproval: false, enabled: true, active: false, name: 'Dashboard', icon: 'fa-tachometer', path: '/dashboard' },
    { needsapproval: false, enabled: true, active: false, name: 'Appointments', icon: 'fa-calendar-check-o', path: '/appointment' }
  ],
  apiBaseUrl: 'http://marketplace-api.3diligent.com/api/v1',
  managementBaseUrl: 'http://manage-api.3diligent.com/api/v1',
  adminAPIToken: '655d67be-af74-48bb-b707-ce5266f7e8fc',
  CONNECTOR_HOST_URL: 'http://manage.3diligent.com/api/v1',
  PPE_HOST_URL: ' http://ppe-api.3diligent.com/api/v1',
  MARKETPLACE_URL:'http://marketplace.3diligent.com/',
  encryptionKey: '1Kf@%4%3ADfEafw'
};
