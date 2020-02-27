import { browser, by, element, ElementFinder } from 'protractor';

export class Preferences {
  url = '/profile/vendor/preferences';

  navigateTo() {
    browser.get(this.url);
    browser.sleep(1000);
  }

  getSubmitControl(): ElementFinder {
    return element(by.css('button[type=submit]'));
  }

  getToastrControl(): ElementFinder {
    return element(by.css('.toast-message'));
  }
}
