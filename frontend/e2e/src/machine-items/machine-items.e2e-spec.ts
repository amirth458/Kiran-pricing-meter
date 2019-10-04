import { MachineItems } from './machine-items.po';
import { Config } from '../config';
import { browser, Key, ExpectedConditions } from 'protractor';
import { config } from '../../protractor.conf';

describe('Machine Items Page', () => {

  const page: MachineItems = new MachineItems();

  describe('- Add', () => {
    beforeEach(() => {
      page.navigateTo(true);
    });

    it('Page url should be /profile/vendor/machines/add', () => {
      expect(browser.getCurrentUrl()).toContain('/profile/vendor/machines/add');
    });

    it('Form validation should work', () => {
      browser.sleep(300);
      page.getSubmitControl().submit().then(() => {
        browser.sleep(100);
        expect(page.getValidErrorControl.getText()).toBeDefined();
        expect(page.getValidErrorControl.getText()).toContain('Required');
      });
    });

    it('Check duplicated name', () => {
      browser.sleep(300);
      page.fillData(Config.machineItem);
      page.getSubmitControl().submit().then(() => {
        browser.sleep(1000);
        expect(page.getErrorControl.getText()).toBeDefined();
        expect(page.getErrorControl.getText()).toContain('This machine name had already been used.');
      });
    });

    it('Check duplicated serial number', () => {
      browser.sleep(300);
      Config.machineItem.name = Config.machineItem.name + '123';
      page.fillData(Config.machineItem);
      page.getSubmitControl().submit().then(() => {
        browser.sleep(1000);
        expect(page.getErrorControl.getText()).toBeDefined();
        expect(page.getErrorControl.getText()).toContain('This serial number had already been used.');
      });
    });
  });

  describe('- Update', () => {
    beforeEach(() => {
      page.navigateTo(false);
    });

    it('Page url should be /profile/vendor/machines/edit/121', () => {
      expect(browser.getCurrentUrl()).toContain('/profile/vendor/machines/edit/121');
    });

    it('Form validation should work', () => {
      browser.sleep(300);
      page.getNameControl().sendKeys(Key.CONTROL, 'a');
      page.getNameControl().sendKeys(Key.BACK_SPACE);
      page.getSubmitControl().submit().then(() => {
        browser.sleep(100);
        expect(page.getValidErrorControl.getText()).toBeDefined();
        expect(page.getValidErrorControl.getText()).toContain('Required');
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
});
