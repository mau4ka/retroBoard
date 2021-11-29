import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewBoardColumn } from 'src/app/shared/interfaces';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import * as XLSX from 'xlsx';
import { TasksService } from '../shared/services/tasks.service';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss'],
})
export class BoardHeaderComponent implements OnInit {
  @Input() userName!: string;
  @Input() loadingEnd!: boolean;
  @Output() getB: EventEmitter<boolean> = new EventEmitter<boolean>();

  newColumnBox = false;
  catIcon = false;

  formColumn!: FormGroup;

  fileName = 'Board.xlsx';

  constructor(
    public tasksService: TasksService,
    public auth: AuthService,
    private router: Router,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.formColumn = new FormGroup({
      columnName: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  exportExcel(): void {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

  logOut() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  addColumn() {
    if (this.formColumn.invalid) {
      return;
    }

    let column: NewBoardColumn = {
      name: this.formColumn.value.columnName,
    };

    this.tasksService.createColumn(column).subscribe(() => {
      this.getB.emit(true);
    });

    this.alert.success('Column was created!');

    this.formColumn.reset();
  }
}
