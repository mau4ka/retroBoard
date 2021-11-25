import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from 'src/app/shared/interfaces';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TasksService } from '../shared/services/tasks.service';

@Component({
  selector: 'app-board-task',
  templateUrl: './board-task.component.html',
  styleUrls: ['./board-task.component.scss'],
})
export class BoardTaskComponent implements OnInit {
  @Input() item!: Task;
  @Input() taskId!: string;
  @Input() userId!: string;
  @Input() selectedComm!: string[];
  @Output() getB: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public tasksService: TasksService,
    public auth: AuthService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {}

  showComm(taskId: string) {
    if (this.selectedComm.includes(taskId)) {
      this.selectedComm = this.selectedComm.filter((el) => el !== taskId);
    } else {
      this.selectedComm.push(taskId);
    }
  }

  addComm(idCol: string, idTask: string, text: string): void {
    if (idCol && idTask) {
      let newComm = {
        text,
      };
      this.tasksService.addComment(newComm, idCol, idTask).subscribe(() => {
        this.getB.emit(true);
      });
      this.alert.success('You add comment!');
    }
  }

  deleteTask(idCol: string, idTask: string) {
    if (idCol && idTask) {
      let result = confirm('You really want delete task?');
      if (result) {
        this.tasksService.deleteTask(idCol, idTask).subscribe(() => {
          this.getB.emit(true);
        });
        this.alert.danger('You delete task!');
      }
    }
  }

  addLike(idColumn: string, idTask: string, like: any) {
    this.tasksService.setLike(idColumn, idTask).subscribe(() => {
      this.getB.emit(true);
    });
    if (
      window.getComputedStyle(like).getPropertyValue('color') === 'rgb(0, 0, 0)'
    ) {
      like.setAttribute('style', 'color: rgb(255, 0, 0)');
    } else {
      like.setAttribute('style', 'color: rgb(0, 0, 0)');
    }
  }

  heartType(oneTask: Task) {
    return oneTask.likes?.includes(this.userId) ? 'red' : 'black';
  }
}
