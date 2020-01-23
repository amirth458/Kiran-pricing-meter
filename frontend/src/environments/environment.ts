// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  local: true,
  menus: [
    {
      name: "User Management",
      route: "/user",
      icon: "fa fa-users",
      visible: true,
      active: false
    },
    {
      name: "Marketplace",
      route: "/marketplace",
      icon: "fa fa-tools",
      visible: true,
      active: true
    },
    {
      name: "Pricing",
      route: "/pricing",
      icon: "far fa-list-alt",
      visible: true,
      active: true
    },
    {
      name: "Insight",
      route: "/insight",
      icon: "far fa-chart-bar",
      visible: true,
      active: false
    }
  ],
  admin_menus: [],
  extendedmenu: [
    {
      needsapproval: false,
      enabled: true,
      active: false,
      name: "Dashboard",
      icon: "fa-tachometer",
      path: "/dashboard"
    },
    {
      needsapproval: false,
      enabled: true,
      active: false,
      name: "Appointments",
      icon: "fa-calendar-check-o",
      path: "/appointment"
    }
  ],
  apiBaseUrl: "https://dev-admin-api.3diligent.com/api/v1",
  marketApiBaseUrl: "https://dev-marketplace-api.3diligent.com/api/v1",
  managementBaseUrl: "https://dev-manage-api.3diligent.com/api/v1",
  procurementApiBaseUrl: "https://dev-procurement-api.3diligent.com/api/v1",
  adminAPIToken: "655d67be-af74-48bb-b707-ce5266f7e8fc",
  PPE_HOST_URL: "https://dev-ppe-api.3diligent.com/api/v1",
  CONNECTOR_HOST_URL: "https://dev-manage.3diligent.com/api/v1",
  MARKETPLACE_URL: "https://localhost:4200/",
  encryptionKey: "1Kf@%4%3ADfEafw",
  isTestDataEnabled: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
