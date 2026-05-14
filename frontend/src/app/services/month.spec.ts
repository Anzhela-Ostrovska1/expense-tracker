import { TestBed } from '@angular/core/testing';

import { MonthService } from './month';

describe('Month', () => {
  let service: MonthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
