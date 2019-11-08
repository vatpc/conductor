import { TestBed, inject } from '@angular/core/testing';

import { SserService } from './sser.service';

describe('SserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SserService]
    });
  });

  it('should be created', inject([SserService], (service: SserService) => {
    expect(service).toBeTruthy();
  }));
});
