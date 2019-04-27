import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMatchComponent } from './dialog-match.component';

describe('DialogMatchComponent', () => {
  let component: DialogMatchComponent;
  let fixture: ComponentFixture<DialogMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
