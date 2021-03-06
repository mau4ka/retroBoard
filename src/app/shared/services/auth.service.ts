import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  Observable,
  ObservableInput,
  tap,
  throwError,
  Subject,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token(): string | null {
    const date = localStorage.getItem('retro-token-exp') ?? new Date();
    const expDate = new Date(date);
    if (new Date() > expDate) {
      this.logout();
      return null;
    } else {
      return localStorage.getItem('retro-token');
    }
  }

  isLogin(): Promise<boolean> | boolean {
    return !!this.token;
  }

  private setToken(res: any) {
    if (res) {
      const expDate = new Date(new Date().getTime() + 259200 * 1000);
      localStorage.setItem('retro-token', res.jwt_token);
      localStorage.setItem('retro-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }

  login(user: User): Observable<any> {
    return this.http
      .post(`${environment.fbDbUrl}/auth/login`, user)
      .pipe(tap(this.setToken), catchError(this.handleError.bind(this)));
  }

  register(user: User): Observable<any> {
    return this.http
      .post(`${environment.fbDbUrl}/auth/register`, user)
      .pipe(catchError(this.handleError.bind(this)));
  }

  handleError(error: HttpErrorResponse): ObservableInput<any> {
    const message = error.error.message;
    this.error$.next(message);
    return throwError(error);
  }

  logout() {
    this.setToken(null);
  }
}
