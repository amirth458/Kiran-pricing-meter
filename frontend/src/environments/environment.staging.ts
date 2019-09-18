// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
  apiBaseUrl: 'http://3diligent-dms-service-dev.7gzpdma3ia.us-west-2.elasticbeanstalk.com/api/v1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
