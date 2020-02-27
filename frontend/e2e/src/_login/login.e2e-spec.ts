import { LoginPage } from './login.po';
import { browser } from 'protractor';
import { Config } from '../config';

describe('Login Page', () => {
  const page: LoginPage = new LoginPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should locate form', () => {
    expect(page.getLoginForm()).toBeDefined();
  });

  it('Should locate email input', () => {
    expect(page.getEmailControl()).toBeDefined();
  });

  it('Should locate password input', () => {
    expect(page.getPasswordControl()).toBeDefined();
  });

  it('Should locate submit button', () => {
    expect(page.getSubmitButton()).toBeDefined();
  });

  it('Form validation should work', () => {
    page.getEmailControl().sendKeys('example@test.com');
    page.getPasswordControl().sendKeys('');
    expect(page.formControlError).toBeDefined();

    page.getEmailControl().sendKeys('');
    page.getPasswordControl().sendKeys('password');
    expect(page.formControlError).toBeDefined();
  });

  it('Form should return error with wrong email', () => {
    page.getEmailControl().sendKeys('example@test.com');
    page.getPasswordControl().sendKeys('password');
    const btnSubmit = page.getSubmitButton();
    btnSubmit.submit().then(() => {
      expect(page.alertMessage).toBeDefined();
      expect(page.alertMessage.getText()).toContain(
        'Login credentials is incorrect'
      );
    });
  });

  it('Form should return error with wrong password', () => {
    page.getEmailControl().sendKeys(Config.email);
    page.getPasswordControl().sendKeys('password');
    const btnSubmit = page.getSubmitButton();
    btnSubmit.submit().then(() => {
      expect(page.alertMessage).toBeDefined();
      expect(page.alertMessage.getText()).toContain(
        'Login credentials is incorrect'
      );
    });
  });

  it('Form should work with correct credential', () => {
    page.login().then(() => {
      expect(browser.getCurrentUrl()).toContain('/profile/vendor/basics');
    });
  });
});
