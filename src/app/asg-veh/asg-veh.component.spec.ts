import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsgVehComponent } from './asg-veh.component';

describe('AsgVehComponent', () => {
  let component: AsgVehComponent;
  let fixture: ComponentFixture<AsgVehComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsgVehComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsgVehComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
