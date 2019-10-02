import { browser } from 'protractor';

describe('Profile page', () => {

  it('Should redirect to basic details page', () => {
    browser.get('/profile');
    expect(browser.getCurrentUrl()).toContain('/profile/vendor/basics');
  });

  it('Should redirect to basic when unknown url', () => {
    browser.get('/unknown');
    expect(browser.getCurrentUrl()).toContain('/profile/vendor/basics');
  });

});
