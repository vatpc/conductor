import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaCliComponent } from './mapa-cli.component';

describe('MapaCliComponent', () => {
  let component: MapaCliComponent;
  let fixture: ComponentFixture<MapaCliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaCliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
