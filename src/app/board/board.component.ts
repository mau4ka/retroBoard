import { BoardColumn, NewBoardColumn } from './../shared/interfaces';
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
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  tasks: BoardColumn[] = [];
  pSub!: Subscription;

  form!: FormGroup;
  formColumn!: FormGroup;
  newTaskBox = false;
  newColumnBox = false

  constructor(
    private tasksService: TasksService,
    public auth: AuthService,
    private alert: AlertService
  ) {}

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

  addTask() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);
    let task: Task = {
      text: this.form.value.text,
      id: this.form.value.column,
    };

    this.tasksService.create(task).subscribe();
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i]._id === this.form.value.column) {
        this.tasks[i].tasks.push(task);
      }
    }

    this.alert.success('You add new task!');

    this.form.reset();
  }

  addColumn() {
    if (this.formColumn.invalid) {
      return;
    }
    console.log(this.formColumn.value);
    let column: NewBoardColumn = {
      name: this.formColumn.value.columnName
    };

    this.tasksService.createColumn(column).subscribe();
    this.tasks.push({...column, tasks: []})

    this.alert.success('You add new column!');

    this.formColumn.reset();
  }

  ngOnInit(): void {
    this.pSub = this.tasksService.getAll().subscribe((tasks) => {
      this.tasks = tasks[0].tasks;
      console.log(this.tasks);
    });
    this.form = new FormGroup({
      text: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      column: new FormControl(null, Validators.required),
    });
    this.formColumn= new FormGroup({
      columnName: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ])
    });
  }
}
