import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task, BoardColumn } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  create(task: Task, name: string): Observable<Task> {
    return this.http
      .post<Task>(`${environment.fbDbUrl}/board/${name}.json`, task)
      .pipe(
        map((response: any) => {
          return {
            ...task,
            id: response.name,
          };
        })
      );
  }

  updateBoard(idCont: string, container: Task[]) {
    
    let newColumn ={
      id: idCont,
      newTasks: container
    }
    console.log(newColumn);
    return this.http.patch(
      `${environment.fbDbUrl}/board/column`,
      newColumn
    );
  }

  getAll(): Observable<any> {
    return this.http.get(`${environment.fbDbUrl}/board`).pipe(
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
              tasks: mau,
            });
          }
          return board;
        } else {
          return;
        }
      })
    );
  }


  remove(id: string | undefined): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }
}
