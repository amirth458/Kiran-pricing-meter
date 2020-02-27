import { browser, by, element, ElementFinder } from 'protractor';
import { Config } from '../config';

export class LoginPage {
  url = '/login';

  navigateTo() {
    return browser.get(this.url);
  }

  login() {
    this.getEmailControl().sendKeys(Config.email);
    this.getPasswordControl().sendKeys(Config.password);
    const btnSubmit = this.getSubmitButton();
    return btnSubmit.submit().then(() => browser.sleep(5000));
  }

  getLoginForm(): ElementFinder {
    return element(by.tagName('form'));
  }

  getSubmitButton(): ElementFinder {
    return element(by.css('button[type="submit"]'));
  }

  getEmailControl(): ElementFinder {
    return element(by.css('input[formControlName=email]'));
  }

  getPasswordControl(): ElementFinder {
    return element(by.css('input[formControlName=password]'));
  }

  get alertMessage(): ElementFinder {
    return element(by.css('.error'));
  }

  get formControlError(): ElementFinder {
    return element(by.css('.errorContainer'));
  }
}
