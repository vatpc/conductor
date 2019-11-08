import { TestBed, inject } from '@angular/core/testing';

import { SempresasService } from './sempresas.service';

describe('SempresasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SempresasService]
    });
  });

  it('should be created', inject([SempresasService], (service: SempresasService) => {
    expect(service).toBeTruthy();
  }));
});
