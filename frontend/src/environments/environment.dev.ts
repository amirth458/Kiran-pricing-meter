export const environment = {
  production: true,
  menu: [
    { name: 'Home', url: '/home', external: false },
    { name: 'About Us', url: '', external: true },
    { name: 'Contact Us', url: '', external: true },
    { name: 'Blog', url: '', external: true }
  ],
  extendedmenu: [
    { needsapproval: false, enabled: true, active: false, name: 'Dashboard', icon: 'fa-tachometer', path: '/dashboard' },
    { needsapproval: false, enabled: true, active: false, name: 'Appointments', icon: 'fa-calendar-check-o', path: '/appointment' }
  ],
  serviceurl: '',
  apiBaseUrl: 'http://3diligent-dms-service-dev.7gzpdma3ia.us-west-2.elasticbeanstalk.com/api/v1'
};
