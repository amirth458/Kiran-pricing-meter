import { ShippingItems } from './shipping-items.po';
import { browser, Key, ExpectedConditions } from 'protractor';

describe('Shipping Items Page', () => {
  const page: ShippingItems = new ShippingItems();

  describe('- Add', () => {
    beforeEach(() => {
      page.navigateTo(true);
    });

    it('Page url should be /profile/vendor/shipping/add', () => {
      expect(browser.getCurrentUrl()).toContain('/profile/vendor/shipping/add');
    });

    it('Form validation should work', () => {
      browser.sleep(300);
      page
        .getSubmitControl()
        .submit()
        .then(() => {
          browser.sleep(100);
          expect(page.getValidErrorControl.getText()).toBeDefined();
          expect(page.getValidErrorControl.getText()).toContain('Required');
        });
    });
  });

  describe('- Update', () => {
    beforeEach(() => {
      page.navigateTo(false);
    });

    it('Page url should be /profile/vendor/shipping/edit/48', () => {
      expect(browser.getCurrentUrl()).toContain(
        '/profile/vendor/shipping/edit/48'
      );
    });

    it('Form validation should work', () => {
      browser.sleep(300);
      page.getAccountIdControl().sendKeys(Key.CONTROL, 'a');
      page.getAccountIdControl().sendKeys(Key.BACK_SPACE);
      page
        .getSubmitControl()
        .submit()
        .then(() => {
          browser.sleep(100);
          expect(page.getValidErrorControl.getText()).toBeDefined();
          expect(page.getValidErrorControl.getText()).toContain('Required');
        });
    });
    describe('Submit Button', () => {
      it('If save is successfully, then message should contain "is updated"', () => {
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
                  'is updated'
                );
              });
          });
      });
    });
  });
});
