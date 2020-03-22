// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  local: false,
  menus: [
    {
      name: 'User Management',
      route: '/user-manage',
      icon: 'fa fa-users',
      visible: true,
      active: true
    },
    {
      name: 'Marketplace',
      route: '/marketplace',
      icon: 'fa fa-tools',
      visible: true,
      active: true
    },
    {
      name: 'Pricing',
      route: '/pricing',
      icon: 'far fa-list-alt',
      visible: true,
      active: true
    },
    {
      name: 'Insight',
      route: '/insight',
      icon: 'far fa-chart-bar',
      visible: true,
      active: false
    },
    {
      name: 'Billing',
      route: '/billing',
      icon: 'fas fa-file-invoice-dollar',
      visible: true,
      active: true
    }
    // {
    //   name: 'Projects',
    //   route: '/projects',
    //   icon: 'fas fa-folder',
    //   visible: true,
    //   active: true
    // }
  ],
  admin_menus: [],
  extendedmenu: [
    {
      needsapproval: false,
      enabled: true,
      active: false,
      name: 'Dashboard',
      icon: 'fa-tachometer',
      path: '/dashboard'
    }
  ],
  apiBaseUrl: 'https://stage-admin-api.3diligent.com/api/v1',
  marketApiBaseUrl: 'https://stage-marketplace-api.3diligent.com/api/v1',
  managementBaseUrl: 'https://stage-manage-api.3diligent.com/api/v1',
  procurementApiBaseUrl: 'https://stage-procurement-api.3diligent.com/api/v1',
  adminAPIToken: '655d67be-af74-48bb-b707-ce5266f7e8fc',
  MARKETPLACE_URL: 'https://stage-marketplace.3diligent.com/',
  PPE_HOST_URL: 'https://stage-ppe-api.3diligent.com/api/v1',
  CONNECTOR_HOST_URL: 'https://stage-manage.3diligent.com/api/v1',
  encryptionKey: '1Kf@%4%3ADfEafw',
  isTestDataEnabled: true,
  reCaptureKey: '6LceotMUAAAAAHLC5TGgsXyh0fHYzsXij0itq2j2'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
