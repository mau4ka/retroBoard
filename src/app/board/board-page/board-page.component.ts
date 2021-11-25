import { BoardColumn } from '../../shared/interfaces';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TasksService } from '../shared/services/tasks.service';
import { Task } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-board',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent implements OnInit, OnDestroy {
  tasks: BoardColumn[] = [];
  selectedStyles: string[] = [];
  userName!: string;
  userId!: string;

  pSub!: Subscription;
  uSub!: Subscription;

  newTaskBox = false;
  loadingEnd = false;

  @ViewChild('widgetsContent', { read: ElementRef })
  public widgetsContent!: ElementRef<any>;

  constructor(
    public tasksService: TasksService,
    public auth: AuthService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.getBoard();

    this.uSub = this.tasksService.getUser().subscribe((user) => {
      this.userName = user.name;
      this.userId = user.userId;
    });
  }

  getBoard() {
    this.pSub = this.tasksService.getAll().subscribe((tasks) => {
      this.tasks = tasks[0].tasks;
      this.loadingEnd = true;
    });
  }

  onNewCol(event: boolean) {
    if (event) {
      this.getBoard();
    }
  }

  dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.tasksService.updateBoard(event.container.data).subscribe();
  }

  drop(event: CdkDragDrop<Task[]>, taskId: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.tasksService
        .updateColumn(event.container.id, event.container.data)
        .subscribe();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.tasksService
        .updateColumn(event.container.id, event.container.data)
        .subscribe();
      this.tasksService
        .updateColumn(event.previousContainer.id, event.previousContainer.data)
        .subscribe();
    }
  }

  newTask(taskText: string, columnId: string) {
    if (taskText && columnId) {
      let task: Task = {
        text: taskText,
        id: columnId,
      };

      this.tasksService.create(task).subscribe(() => {
        this.getBoard();
      });
      this.alert.success('You add new task!');
    }
  }

  deleteTask(idCol: string, idTask: string) {
    if (idCol && idTask) {
      let result = confirm('You really want delete task?');
      if (result) {
        this.tasksService.deleteTask(idCol, idTask).subscribe(() => {
          this.getBoard();
        });
        this.alert.danger('You delete task!');
      }
    }
  }

  deleteColumn(idCol: string) {
    if (idCol) {
      let result = confirm('You really want delete column?');
      if (result) {
        this.tasksService.deleteColumn(idCol).subscribe(() => {
          this.getBoard();
        });
        this.alert.danger('You delete column!');
      }
    }
  }

  addLike(idColumn: string, idTask: string) {
    this.tasksService.setLike(idColumn, idTask).subscribe(() => {
      this.getBoard();
    });
  }

  heartType(oneTask: Task) {
    return oneTask.likes?.includes(this.userId) ? 'red' : 'black';
  }
  showComm(taskId: string) {
    if (this.selectedStyles.includes(taskId)) {
      this.selectedStyles = this.selectedStyles.filter((el) => el !== taskId);
    } else {
      this.selectedStyles.push(taskId);
    }
  }

  addComm(idCol: string, idTask: string, text: string): void {
    if (idCol && idTask) {
      let newComm = {
        text,
      };
      this.tasksService.addComment(newComm, idCol, idTask).subscribe(() => {
        this.getBoard();
      });
      this.alert.success('You add comment!');
    }
  }

  scrollRigth() {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft + 360,
      behavior: 'smooth',
    });
  }

  scrollLeft() {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft - 360,
      behavior: 'smooth',
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }

    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }
}
