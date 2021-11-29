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
  @Output() showCommOut: EventEmitter<string> = new EventEmitter<string>();

  heart = false;

  constructor(
    public tasksService: TasksService,
    public auth: AuthService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {}

  showComm(taskId: string) {
    this.showCommOut.emit(taskId);
  }

  addComm(idCol: string, idTask: string, text: string): void {
    if (idCol && idTask) {
      let newComm = {
        text,
      };
      this.tasksService.addComment(newComm, idCol, idTask).subscribe(() => {
        this.getB.emit(true);
      });
      this.alert.success('Comment was created!');
    }
  }

  deleteTask(idCol: string, idTask: string) {
    if (idCol && idTask) {
      let result = confirm('You really want delete task?');
      if (result) {
        this.tasksService.deleteTask(idCol, idTask).subscribe(() => {
          this.getB.emit(true);
        });
        this.alert.danger('Task was deleted!');
      }
    }
  }

  addLike(idColumn: string, idTask: string, like: any) {
    this.heart = true;
    this.tasksService.setLike(idColumn, idTask).subscribe(() => {
      this.heart = false;
      this.getB.emit(true);
    });
  }

  heartType(oneTask: Task) {
    return oneTask.likes?.includes(this.userId) ? 'red' : 'black';
  }
}
