import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificComponent } from './notific.component';

describe('NotificComponent', () => {
  let component: NotificComponent;
  let fixture: ComponentFixture<NotificComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
