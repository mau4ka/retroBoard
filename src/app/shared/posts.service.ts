import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post, BoardColumn } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}

  create(post: Post, name: string): Observable<Post> {
    return this.http
      .post<Post>(`${environment.fbDbUrl}/board/${name}.json`, post)
      .pipe(
        map((response: any) => {
          return {
            ...post,
            id: response.name,
          };
        })
      );
  }

  updateBoard(nameCont: string, container: any) {
    console.log(nameCont, container)
    console.log(`${environment.fbDbUrl}board/${nameCont}.json`)
    return this.http.patch(`${environment.fbDbUrl}board/${nameCont}/posts.json`, container);
  }

  getAll(): Observable<any> {
    return this.http.get(`${environment.fbDbUrl}/board.json`).pipe(
      map((response: any) => {
        if (response) {
          let board = [];
          for (let column in response) {
            console.log(column);
            let mau = Object.keys(response[column]).map((key) => ({
              ...response[column][key],
              id: key,
            }));

            board.push({
              id: column,
              posts: mau,
            });
          }
          return board;
        } else {
          return;
        }
      })
    );
  }

  getById(id: string | undefined): Observable<Post> {
    return this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`).pipe(
      map((post: Post) => {
        return {
          ...post,
          id,
        };
      })
    );
  }

  remove(id: string | undefined): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }
}
