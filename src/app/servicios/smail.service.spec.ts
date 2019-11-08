import { TestBed, inject } from '@angular/core/testing';

import { SmailService } from './smail.service';

describe('SmailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmailService]
    });
  });

  it('should be created', inject([SmailService], (service: SmailService) => {
    expect(service).toBeTruthy();
  }));
});
