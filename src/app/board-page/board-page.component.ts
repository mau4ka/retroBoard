import { BoardColumn, NewBoardColumn } from '../shared/interfaces';
import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TasksService } from '../shared/services/tasks.service';
import { Task } from '../shared/interfaces';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { AlertService } from '../shared/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent implements OnInit {
  loadingEnd = false;
  tasks: BoardColumn[] = [];
  userName!: string;
  userId!: string;
  pSub!: Subscription;
  uSub!: Subscription;

  catIcon = false;

  selectedStyles: string[] = [];

  form!: FormGroup;
  formColumn!: FormGroup;
  newTaskBox = false;
  newColumnBox = false;

  constructor(
    private tasksService: TasksService,
    public auth: AuthService,
    private alert: AlertService,
    private router: Router
  ) {}

  showComm(taskId: string) {
    if (this.selectedStyles.includes(taskId)) {
      this.selectedStyles = this.selectedStyles.filter((el) => el !== taskId);
    } else {
      this.selectedStyles.push(taskId);
    }
  }

  addComm(idCont: string, idTask: string, text: string): void {
    if (idCont && idTask) {
      let newComm = {
        id: idCont,
        idTask,
        text,
      };
      this.tasksService.addComment(newComm).subscribe(() => {
        this.getBoard();
      });
    }
  }

  logOut() {
    console.log('mm');
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  heartType(oneTask: Task) {
    return oneTask.likes?.includes(this.userId) ? 'red' : 'black';
  }

  drop(event: CdkDragDrop<Task[]>, taskId: string) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.tasksService
        .updateBoard(event.container.id, event.container.data)
        .subscribe();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.tasksService
        .updateBoard(event.container.id, event.container.data)
        .subscribe();
      this.tasksService
        .updateBoard(event.previousContainer.id, event.previousContainer.data)
        .subscribe();
    }
  }

  getBoard() {
    this.pSub = this.tasksService.getAll().subscribe((tasks) => {
      this.tasks = tasks[0].tasks;
      this.loadingEnd = true;
    });
  }

  addTask() {
    if (this.form.invalid) {
      return;
    }
    let task: Task = {
      text: this.form.value.text,
      id: this.form.value.column,
    };

    this.tasksService.create(task).subscribe(() => {
      this.getBoard();
    });
    this.alert.success('You add new task!');
    this.form.reset();
  }

  addColumn() {
    if (this.formColumn.invalid) {
      return;
    }
    console.log(this.formColumn.value);
    let column: NewBoardColumn = {
      name: this.formColumn.value.columnName,
    };

    this.tasksService.createColumn(column).subscribe(() => {
      this.getBoard();
    });

    this.alert.success('You add new column!');

    this.formColumn.reset();
  }

  addLike(idColumn: string, idTask: string) {
    this.tasksService.setLike(idColumn, idTask).subscribe(() => {
      this.getBoard();
    });
  }

  ngOnInit(): void {
    this.getBoard();

    this.uSub = this.tasksService.getUser().subscribe((user) => {
      this.userName = user.name;
      this.userId = user.userId;
    });

    this.form = new FormGroup({
      text: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      column: new FormControl(null, Validators.required),
    });
    this.formColumn = new FormGroup({
      columnName: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }
}
