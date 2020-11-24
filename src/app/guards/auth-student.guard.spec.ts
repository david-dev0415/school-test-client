import { TestBed } from '@angular/core/testing';

import { AuthStudentGuard } from './auth-student.guard';

describe('AuthStudentGuard', () => {
  let guard: AuthStudentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthStudentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
