import { browser, by, Key, element, ElementFinder } from 'protractor';
export class ShippingItems {
  urlAdd = '/profile/vendor/shipping/add';
  urlEdit = '/profile/vendor/shipping/edit/48';

  navigateTo(flag: boolean = true) {
    if (flag) {
      browser.get(this.urlAdd);
    } else {
      browser.get(this.urlEdit);
    }
    browser.sleep(1000);
  }

  fillData(data: any) {
    this.setDataInComponent('input[formControlName=name]', data.name);
    this.setDataInComponent(
      'input[formControlName=serialNumber]',
      data.serialNumber
    );
    this.setDataInComponent(
      'ng-select[formControlName=equipment] input',
      data.equipment
    );
    browser.sleep(2000);
    this.selectData('ng-select[formControlName=equipment] input');
    this.setDataInComponent(
      'ng-select[formControlName=material] input',
      data.material
    );
    browser.sleep(2000);
    this.selectData('ng-select[formControlName=material] input');

    this.setDataInComponent(
      'select[formControlName=vendorFacility]',
      data.facility,
      false
    );
  }

  setDataInComponent(
    cssString: string,
    strData: string,
    editable: boolean = true
  ) {
    if (editable) {
      element(by.css(cssString)).clear();
      element(by.css(cssString)).sendKeys(strData);
    } else {
      element(by.css(cssString + ' option[value="' + strData + '"]')).click();
    }
  }

  selectData(cssString: string) {
    element(by.css(cssString)).sendKeys(Key.DOWN);
    element(by.css(cssString)).sendKeys(Key.ENTER);
  }

  getSubmitControl(): ElementFinder {
    return element(by.css('button[type=submit]'));
  }
  getAccountIdControl(): ElementFinder {
    return element(by.css('input[formControlName=accountId]'));
  }
  getToastrControl(): ElementFinder {
    return element(by.css('.toast-message'));
  }

  get getValidErrorControl(): ElementFinder {
    return element(by.css('.footnote.red'));
  }

  get getErrorControl(): ElementFinder {
    return element(by.css('.alert-danger'));
  }
}
