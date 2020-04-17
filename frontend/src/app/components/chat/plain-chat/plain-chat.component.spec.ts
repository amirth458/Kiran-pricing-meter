import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainChatComponent } from './plain-chat.component';

describe('PlainChatComponent', () => {
  let component: PlainChatComponent;
  let fixture: ComponentFixture<PlainChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlainChatComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
