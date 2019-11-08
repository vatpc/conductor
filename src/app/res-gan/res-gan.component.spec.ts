import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResGanComponent } from './res-gan.component';

describe('ResGanComponent', () => {
  let component: ResGanComponent;
  let fixture: ComponentFixture<ResGanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResGanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResGanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
