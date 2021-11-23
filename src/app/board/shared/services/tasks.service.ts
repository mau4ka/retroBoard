import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  BoardColumn,
  getUser,
  NewBoardColumn,
  NewComment,
  Task,
} from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

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

  getAll(): Observable<{ id: string; tasks: BoardColumn[] }[] | []> {
    return this.http.get(`${environment.fbDbUrl}/board`).pipe(
      map((response: { [key: string]: any }) => {
        if (response) {
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

  updateBoard(board: BoardColumn[]) {
    let updatedBoard = {
      board,
    };
    return this.http.put(`${environment.fbDbUrl}/board/`, updatedBoard).pipe(
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

  updateColumn(idCol: string, container: Task[]) {
    let newColumn = {
      newTasks: container,
    };
    return this.http
      .patch(`${environment.fbDbUrl}/board/column/${idCol}`, newColumn)
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

  deleteColumn(idCol: string) {
    return this.http
      .delete(`${environment.fbDbUrl}/board/column/${idCol}`)
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

  addComment(newComm: NewComment, idColumn: string, idTask: string) {
    return this.http
      .put(`${environment.fbDbUrl}/board/comm/${idColumn}/${idTask}`, newComm)
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

  setLike(idColumn: string, idTask: string) {
    return this.http
      .patch(`${environment.fbDbUrl}/board/like/${idColumn}/${idTask}`, null)
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

  deleteTask(idColumn: string, idTask: string) {
    return this.http
      .delete(`${environment.fbDbUrl}/board/del/${idColumn}/${idTask}`)
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
}
