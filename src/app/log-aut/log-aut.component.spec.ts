import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogAutComponent } from './log-aut.component';

describe('LogAutComponent', () => {
  let component: LogAutComponent;
  let fixture: ComponentFixture<LogAutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogAutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogAutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
