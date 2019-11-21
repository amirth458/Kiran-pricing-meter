import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceContainerComponent } from './marketplace-container.component';

describe('MarketplaceContainerComponent', () => {
  let component: MarketplaceContainerComponent;
  let fixture: ComponentFixture<MarketplaceContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
