import { Preferences } from './preferences.po';
import { browser, Key, ExpectedConditions } from 'protractor';

describe('Preferences', () => {
  const page: Preferences = new Preferences();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Page url should be /profile/vendor/preferences', () => {
    expect(browser.getCurrentUrl()).toContain('/profile/vendor/preferences');
  });

  describe('Submit Button', () => {
    it('If save is successfully, then message should contain "is updated Successfully"', () => {
      browser.sleep(500);
      page
        .getSubmitControl()
        .submit()
        .then(() => {
          browser
            .wait(
              ExpectedConditions.visibilityOf(page.getToastrControl()),
              15000,
              page.getToastrControl().locator()
            )
            .then(() => {
              expect(page.getToastrControl().getText()).toContain(
                'is updated Successfully'
              );
            });
        });
    });
  });
});
