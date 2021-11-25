import { BoardColumn, NewBoardColumn } from '../../shared/interfaces';
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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { AlertService } from '../../shared/services/alert.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

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

  fileName = 'ExcelSheet.xlsx';

  formColumn!: FormGroup;
  newTaskBox = false;
  newColumnBox = false;
  catIcon = false;
  loadingEnd = false;

  @ViewChild('widgetsContent', { read: ElementRef })
  public widgetsContent!: ElementRef<any>;

  constructor(
    public tasksService: TasksService,
    public auth: AuthService,
    private alert: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBoard();

    this.uSub = this.tasksService.getUser().subscribe((user) => {
      this.userName = user.name;
      this.userId = user.userId;
    });

    this.formColumn = new FormGroup({
      columnName: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  logOut() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getBoard() {
    this.pSub = this.tasksService.getAll().subscribe((tasks) => {
      this.tasks = tasks[0].tasks;
      this.loadingEnd = true;
    });
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

  addColumn() {
    if (this.formColumn.invalid) {
      return;
    }

    let column: NewBoardColumn = {
      name: this.formColumn.value.columnName,
    };

    this.tasksService.createColumn(column).subscribe(() => {
      this.getBoard();
    });

    this.alert.success('You add new column!');

    this.formColumn.reset();
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
  exportexcel(): void {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
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
