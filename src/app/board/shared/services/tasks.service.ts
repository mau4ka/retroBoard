import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  map,
  Observable,
  ObservableInput,
  Subject,
  throwError,
} from 'rxjs';
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
  public error$: Subject<string> = new Subject<string>();

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
      }),
      catchError(this.handleError.bind(this))
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
      }),
      catchError(this.handleError.bind(this))
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
      }),
      catchError(this.handleError.bind(this))
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
      }),
      catchError(this.handleError.bind(this))
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
        }),
        catchError(this.handleError.bind(this))
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
        }),
        catchError(this.handleError.bind(this))
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
      }),
      catchError(this.handleError.bind(this))
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
        }),
        catchError(this.handleError.bind(this))
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
        }),
        catchError(this.handleError.bind(this))
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
        }),
        catchError(this.handleError.bind(this))
      );
  }

  handleError(error: HttpErrorResponse): ObservableInput<any> {
    const message = error.error.message;
    this.error$.next(message);
    return throwError(error);
  }
}
