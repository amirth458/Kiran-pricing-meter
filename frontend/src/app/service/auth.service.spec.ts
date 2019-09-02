import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AuthService', () => {
  const httpSpy = jasmine.createSpyObj('HttpClient', ['HttpHandler']);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [HttpClient, HttpHandler]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
