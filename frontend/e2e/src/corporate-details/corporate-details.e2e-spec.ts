import { CorporateDetails } from './corporate-details.po';
import { Config } from '../config';
import { browser, Key, ExpectedConditions } from 'protractor';

describe('Corporate Details Page', () => {

  const page: CorporateDetails = new CorporateDetails();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Page url should be /profile/vendor/basics', () => {
    expect(browser.getCurrentUrl()).toContain('/profile/vendor/basics');
  });

  it('Form validation should work', () => {
    page.fillData(Config.corporateDetails);
    page.getVendorNameControl().sendKeys(Key.CONTROL, 'a');
    page.getVendorNameControl().sendKeys(Key.BACK_SPACE);
    browser.sleep(100);
    expect(page.getValidErrorControl.getText()).toBeDefined();
    expect(page.getValidErrorControl.getText()).toContain('Required');
  });

  describe('Check Vendor Type', () => {
    it('If vendor type is "Company/LLC - Contract Manufacturing", vendor industry should be "Manufacturing"', () => {
      browser.sleep(100);
      page.setDataInComponent('select[formControlName=vendorType]', '6', false);
      expect(page.getVendorIndustryControl().getText()).toEqual('Manufacturing');
    });
    it('If vendor type is "Company/LLC - Industry", vendor industry should be "Choose" and eveything should be enabled.', () => {
      browser.sleep(100);
      page.setDataInComponent('select[formControlName=vendorType]', '1', false);
      expect(page.getVendorIndustryControl().getText()).toEqual('Choose...');
    });
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

  describe('Submit button', () => {
    it('If save is successfully, then message should contain "is updated Successfully"', () => {
      browser.sleep(500);
      page.getSubmitControl().submit().then(() => {
        browser.wait(ExpectedConditions.visibilityOf(page.getToastrControl()), 15000, page.getToastrControl().locator()).then(() => {
          expect(page.getToastrControl().getText()).toContain('is updated Successfully');
        });
      });
    });
    it('If save is not successfully, then error message should include "We are sorry"', () => {
      browser.sleep(500);
      page.getEmailControl().clear();
      page.getEmailControl().sendKeys('ivantest1@gmail.com');
      page.getSubmitControl().submit().then(() => {
        browser.wait(ExpectedConditions.visibilityOf(page.getToastrControl()), 15000, page.getToastrControl().locator()).then(() => {
          expect(page.getToastrControl().getText()).toContain('We are sorry');
        });
      });
    });
  });
});
