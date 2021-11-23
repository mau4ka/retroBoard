import { SharedModule } from './../shared/shared.module';
import { PreloaderComponent } from './../shared/components/preloader/preloader.component';

import { SvgHeartComponent } from './shared/components/svg-heart/svg-heart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardPageComponent } from './board-page/board-page.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [BoardPageComponent, SvgHeartComponent, PreloaderComponent],
  imports: [CommonModule, BoardRoutingModule, DragDropModule, SharedModule],
})
export class BoardModule {}
