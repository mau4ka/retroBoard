import { BoardColumn } from './../shared/interfaces';
import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TasksService } from '../shared/services/tasks.service';
import { Task } from '../shared/interfaces';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  tasks: BoardColumn[] = [];
  pSub!: Subscription;

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

  submit(column: string) {
    const task: Task = {
      author: 'author',
      text: 'text',
      likes: 0,
    };

    this.tasksService.create(task, column).subscribe(() => {
      alert(task.text);
    });
  }

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.pSub = this.tasksService.getAll().subscribe((tasks) => {
      this.tasks = tasks[0].tasks;
      console.log(this.tasks);
    });
  }
}
