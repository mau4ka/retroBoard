import { BoardColumn, getUser, NewComment } from './../interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task, NewBoardColumn } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  create(task: Task) {
    return this.http.post(`${environment.fbDbUrl}/board`, task).pipe(
      map((response) => {
        if (response) {
          return response;
        } else {
          return;
        }
      })
    );
  }

  createColumn(column: NewBoardColumn) {
    return this.http.post(`${environment.fbDbUrl}/board/column`, column).pipe(
      map((response) => {
        if (response) {
          return response;
        } else {
          return;
        }
      })
    );
  }

  updateBoard(idCont: string, container: Task[]) {
    let newColumn = {
      id: idCont,
      newTasks: container,
    };
    return this.http
      .patch(`${environment.fbDbUrl}/board/column`, newColumn)
      .pipe(
        map((response) => {
          if (response) {
            return response;
          } else {
            return;
          }
        })
      );
  }

  addComment(newComm: NewComment) {
    return this.http.put(`${environment.fbDbUrl}/board/comm`, newComm).pipe(
      map((response) => {
        if (response) {
          return response;
        } else {
          return;
        }
      })
    );
  }

  setLike(idColumn: string, idTask: string) {
    let like = {
      id: idColumn,
      idTask,
    };
    return this.http.patch(`${environment.fbDbUrl}/board/like`, like).pipe(
      map((response) => {
        if (response) {
          return response;
        } else {
          return;
        }
      })
    );
  }

  getAll(): Observable<{ id: string; tasks: BoardColumn[] }[] | []> {
    return this.http.get(`${environment.fbDbUrl}/board`).pipe(
      map((response: { [key: string]: any }) => {
        if (response) {
          console.log(response);
          let board = [];
          for (let column in response) {
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
          return [];
        }
      })
    );
  }

  getUser(): Observable<getUser> {
    return this.http.get(`${environment.fbDbUrl}/board/user`).pipe(
      map((response: { [key: string]: any }) => {
        if (response) {
          let user = {
            name: response['name'],
            email: response['email'],
            userId: response['userId'],
          };
          return user;
        } else {
          return {
            name: response['name'],
            email: response['email'],
            userId: response['userId'],
          };
        }
      })
    );
  }
}
