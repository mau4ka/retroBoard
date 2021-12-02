import { BoardColumn } from '../../shared/interfaces';
import {
  AfterViewChecked,
  ChangeDetectorRef,
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
export class BoardPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  tasks: BoardColumn[] = [];
  selectedComm: string[] = [];
  userName!: string;
  userId!: string;
  scroll: boolean = false;
  newTaskBox: boolean = false;
  loadingEnd: boolean = false;

  pSub!: Subscription;
  uSub!: Subscription;

  @ViewChild('boardComponent', { read: ElementRef })
  public boardComponent!: ElementRef<HTMLElement>;

  constructor(
    public tasksService: TasksService,
    public auth: AuthService,
    private alert: AlertService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getBoard();

    this.uSub = this.tasksService.getUser().subscribe((user) => {
      this.userName = user.name;
      this.userId = user.userId;
    });
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  getBoard(): void {
    this.pSub = this.tasksService.getAll().subscribe((tasks) => {
      this.tasks = tasks[0].tasks;
      this.loadingEnd = true;
    });
  }

  onCommShow(taskId: string): void {
    if (this.selectedComm.includes(taskId)) {
      this.selectedComm = this.selectedComm.filter((el) => el !== taskId);
    } else {
      this.selectedComm.push(taskId);
    }
  }

  onNewCol(event: boolean): void {
    if (event) {
      this.getBoard();
    }
  }

  checkScroll(): boolean {
    return this.boardComponent
      ? this.boardComponent.nativeElement.scrollWidth > window.innerWidth
      : false;
  }

  dropColumn(event: CdkDragDrop<BoardColumn[]>): void {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.tasksService.updateBoard(event.container.data).subscribe();
  }

  drop(event: CdkDragDrop<Task[]>, taskId: string): void {
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

  newTask(taskText: string, columnId: string): void {
    if (taskText && columnId) {
      let task: Task = {
        text: taskText,
        id: columnId,
      };

      this.tasksService.createTask(task).subscribe(() => {
        this.getBoard();
      });
      this.alert.success('Task was created!');
    }
  }

  deleteColumn(idCol: string): void {
    if (idCol) {
      let result = confirm('You really want delete column?');
      if (result) {
        this.tasksService.deleteColumn(idCol).subscribe(() => {
          this.getBoard();
        });
        this.alert.danger('Column was deleted!');
      }
    }
  }

  scrollRight(): void {
    this.boardComponent.nativeElement.scrollTo({
      left: this.boardComponent.nativeElement.scrollLeft + 360,
      behavior: 'smooth',
    });
  }

  scrollLeft(): void {
    this.boardComponent.nativeElement.scrollTo({
      left: this.boardComponent.nativeElement.scrollLeft - 360,
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
