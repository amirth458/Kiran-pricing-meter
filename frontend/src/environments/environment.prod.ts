export const environment = {
  production: true,
  local: false,
  menus: [
    {
      name: "Program",
      route: "/program",
      icon: "far fa-file-alt",
      visible: true,
      active: false
    },
    {
      name: "Insight",
      route: "/insight",
      icon: "far fa-chart-bar",
      visible: true,
      active: false
    },
    {
      name: "Setting",
      route: "/setting",
      icon: "fas fa-cogs",
      visible: true,
      active: false
    },
    {
      name: "Design",
      route: "/design",
      icon: "far fa-edit",
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
  apiBaseUrl: "https://admin-api.3diligent.com/api/v1",
  marketApiBaseUrl: "https://marketplace-api.3diligent.com/api/v1",
  managementBaseUrl: "https://manage-api.3diligent.com/api/v1",
  procurementApiBaseUrl: "https://procurement-api.3diligent.com/api/v1",
  adminAPIToken: "655d67be-af74-48bb-b707-ce5266f7e8fc",
  CONNECTOR_HOST_URL: "https://manage.3diligent.com/api/v1",
  PPE_HOST_URL: " https://ppe-api.3diligent.com/api/v1",
  MARKETPLACE_URL: "https://marketplace.3diligent.com/",
  encryptionKey: "1Kf@%4%3ADfEafw",
  isTestDataEnabled: false
};
