import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetComponent } from './list-det.component';

describe('ListDetComponent', () => {
  let component: ListDetComponent;
  let fixture: ComponentFixture<ListDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
