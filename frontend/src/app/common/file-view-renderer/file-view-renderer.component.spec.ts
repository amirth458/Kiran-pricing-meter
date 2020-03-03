import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileViewRendererComponent } from './file-view-renderer.component';

describe('FileViewRendererComponent', () => {
  let component: FileViewRendererComponent;
  let fixture: ComponentFixture<FileViewRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileViewRendererComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileViewRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
