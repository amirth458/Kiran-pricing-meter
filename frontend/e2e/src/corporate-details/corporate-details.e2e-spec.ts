import { CorporateDetails } from './corporate-details.po';
import { Config } from '../config';
import { browser, Key } from 'protractor';

describe('Corporate Details Page', () => {

  const page: CorporateDetails = new CorporateDetails();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Page url should be /profile/vendor/basics', () => {
    expect(browser.getCurrentUrl()).toContain('/profile/vendor/basics');
  });

  // it('Form validation should work', () => {
  //   page.fillData(Config.corporateDetails);
  //   page.getVendorNameControl().sendKeys(Key.CONTROL, 'a');
  //   page.getVendorNameControl().sendKeys(Key.BACK_SPACE);
  //   browser.sleep(100);
  //   expect(page.getValidErrorControl.getText()).toBeDefined();
  //   expect(page.getValidErrorControl.getText()).toContain('Required');
  // });

  // describe('Check Vendor Type', () => {
  //   it('set "Company/LLC - Contract Manufacturing"', () => {
  //     browser.sleep(100);
  //     page.setDataInComponent('select[formControlName=vendorType]', '6', false);
  //     expect(page.getVendorIndustryControl().getText()).toEqual('Manufacturing');
  //   });
  //   it('set "Company/LLC - Industry"', () => {
  //     browser.sleep(100);
  //     page.setDataInComponent('select[formControlName=vendorType]', '1', false);
  //     expect(page.getVendorIndustryControl().getText()).toEqual('Choose...');
  //   });
  // });

  // describe('Check Phone number change', () => {
  //   it('set United States number', () => {
  //     browser.sleep(100);
  //     page.setDataInComponent('international-phone-number input', '+1 4155558721');
  //     expect(page.getCountryControl().getText()).toEqual('United States');
  //   });
  //   it('set Albania number', () => {
  //     browser.sleep(100);
  //     page.setDataInComponent('international-phone-number input', '+355 33333333');
  //     expect(page.getCountryControl().getText()).toEqual('Albania');
  //   });
  // });
  
  describe('Save button clicked', () => {
    it('Check success message', () => {
      browser.sleep(100);
      page.getSubmitControl().submit().then(() => {
        expect(page.getToastrControl().getText()).toContain('Saved Successfully');
      });
    });
    it('Check error message', () => {
      browser.sleep(100);
      page.getEmailControl().sendKeys('ivantest1@gmail.com');
      page.getSubmitControl().submit().then(() => {
        expect(page.getToastrControl().getText()).toContain('Saved Successfully');
      });
    });
  });
});
