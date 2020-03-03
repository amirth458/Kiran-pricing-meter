import { browser, by, element, ElementFinder } from 'protractor';

export class FacilityDetails {
  url = '/profile/vendor/facilities/edit/840';

  navigateTo() {
    browser.get(this.url);
    browser.sleep(1000);
  }

  getFacilityForm(): ElementFinder {
    return element(by.tagName('form'));
  }

  getSaveButton(): ElementFinder {
    return element(by.css('button[type="submit"]'));
  }

  fillData(data: any) {
    this.setDataInComponent('input[formControlName=name]', data.name);
    this.setDataInComponent('input[formControlName=email]', data.email);
    this.setDataInComponent(
      'select[formControlName=vendorType]',
      data.vendorType,
      false
    );
    this.setDataInComponent(
      'select[formControlName=vendorIndustry]',
      data.vendorIndustry,
      false
    );
    this.setDataInComponent(
      'input[formControlName=primaryContactFirstName]',
      data.primaryContactFirstName
    );
    this.setDataInComponent(
      'input[formControlName=primaryContactLastName]',
      data.primaryContactLastName
    );
    this.setDataInComponent('international-phone-number input', data.phone);
    this.setDataInComponent('input[formControlName=street1]', data.street1);
    this.setDataInComponent('input[formControlName=street2]', data.street2);
    this.setDataInComponent('input[formControlName=city]', data.city);
    this.setDataInComponent('input[formControlName=state]', data.state);
    this.setDataInComponent('input[formControlName=zipCode]', data.zipCode);
    this.setDataInComponent(
      '#countryComponent select[formControlName=country]',
      data.country,
      false
    );
    this.setDataInComponent(
      'select[formControlName=confidentiality]',
      data.confidentiality,
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

  getVendorNameControl(): ElementFinder {
    return element(by.css('input[formControlName=name]'));
  }

  getVendorTypeControl(): ElementFinder {
    return element(by.css('select[formControlName=vendorType]'));
  }

  getVendorIndustryControl(): ElementFinder {
    return element(
      by.css('select[formControlName=vendorIndustry] option:checked')
    );
  }

  getEmailControl(): ElementFinder {
    return element(by.css('input[formControlName=email]'));
  }

  getCountryControl(): ElementFinder {
    return element(
      by.css('#countryComponent select[formControlName=country] option:checked')
    );
  }

  getSubmitControl(): ElementFinder {
    return element(by.css('button[type=submit]'));
  }

  getToastrControl(): ElementFinder {
    return element(by.css('.toast-message'));
  }
  get getValidErrorControl(): ElementFinder {
    return element(by.css('.footnote.red'));
  }
}
