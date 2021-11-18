import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task, BoardColumn, NewBoardColumn } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  create(task: Task) {
    console.log(task);

    return this.http.post(`${environment.fbDbUrl}/board`, task);
  }

  createColumn(column: NewBoardColumn) {
    console.log(column);
    return this.http.post(`${environment.fbDbUrl}/board/column`, column);
  }

  updateBoard(idCont: string, container: Task[]) {
    let newColumn = {
      id: idCont,
      newTasks: container,
    };
    console.log(newColumn);
    return this.http.patch(`${environment.fbDbUrl}/board/column`, newColumn);
  }

  setLike(idColumn: string, idTask: string) {
    let like = {
      id: idColumn,
      idTask,
    };
    return this.http.patch(`${environment.fbDbUrl}/board/like`, like);
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

  getUser(): Observable<any> {
    return this.http.get(`${environment.fbDbUrl}/board/user`).pipe(
      map((response: any) => {
        if (response) {
          return response;
        } else {
          return;
        }
      })
    );
  }
}
