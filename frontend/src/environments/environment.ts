// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  menus: [
    {
      name: 'User Management',
      route: '/user',
      icon: 'fa fa-users',
      visible: true,
      active: true
    },
    {
      name: 'Marketplace',
      route: '/marketplace',
      icon: 'fa fa-tools',
      visible: true,
      active: false,
    },
    {
      name: 'Pricing',
      route: '/setting',
      icon: 'far fa-list-alt',
      visible: true,
      active: false,
    },
    {
      name: 'Insight',
      route: '/insight',
      icon: 'far fa-chart-bar',
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
  apiBaseUrl: 'http://dev-marketplace-api.3diligent.com/api/v1',
  managementBaseUrl: 'http://dev-manage-api.3diligent.com/api/v1',

  PPE_HOST_URL: 'http://dev-ppe-api.3diligent.com/api/v1',
  CONNECTOR_HOST_URL: 'http://dev-manage.3diligent.com/api/v1',

  encryptionKey: '1Kf@%4%3ADfEafw'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
