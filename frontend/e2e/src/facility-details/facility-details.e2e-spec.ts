import { FacilityDetails } from './facilty-details.po';
import { Config } from '../config';
import { browser, Key, ExpectedConditions } from 'protractor';

describe('Facility Details Page', () => {

  const page: FacilityDetails = new FacilityDetails();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Page url should be /profile/vendor/facilities/edit/840', () => {
    expect(browser.getCurrentUrl()).toContain('/profile/vendor/facilities/edit/840');
  });

  it('Form validation should work', () => {
    browser.sleep(300);
    page.getVendorNameControl().sendKeys(Key.CONTROL, 'a');
    page.getVendorNameControl().sendKeys(Key.BACK_SPACE);
    browser.sleep(100);
    expect(page.getValidErrorControl.getText()).toBeDefined();
    expect(page.getValidErrorControl.getText()).toContain('Required');
  });

  describe('Check Phone number change', () => {
    it('If Phone number is set with United States number, then country should be United States automatically', () => {
      browser.sleep(100);
      page.setDataInComponent('international-phone-number input', '+1 4155558721');
      expect(page.getCountryControl().getText()).toEqual('United States');
    });
    it('If Phone number is set with Albania number, then country should be Albania automaticallyset', () => {
      browser.sleep(100);
      page.setDataInComponent('international-phone-number input', '+355 33333333');
      expect(page.getCountryControl().getText()).toEqual('Albania');
    });
  });

  describe('Submit Button', () => {
    it('If save is successfully, then message should contain "is updated"', () => {
      browser.sleep(500);
      page.getSubmitControl().submit().then(() => {
        browser.wait(ExpectedConditions.visibilityOf(page.getToastrControl()), 15000, page.getToastrControl().locator()).then(() => {
          expect(page.getToastrControl().getText()).toContain('is updated');
        });
      });
    });
  });
});
