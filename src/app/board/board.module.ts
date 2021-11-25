import { SharedModule } from './../shared/shared.module';
import { PreloaderComponent } from './../shared/components/preloader/preloader.component';

import { SvgHeartComponent } from './shared/components/svg-heart/svg-heart.component';
import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardPageComponent } from './board-page/board-page.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../shared/auth.interseptor';
import { BoardHeaderComponent } from './board-header/board-header.component';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor,
};

@NgModule({
  declarations: [BoardPageComponent, SvgHeartComponent, PreloaderComponent, BoardHeaderComponent],
  imports: [CommonModule, BoardRoutingModule, DragDropModule, SharedModule],
  providers: [INTERCEPTOR_PROVIDER],
})
export class BoardModule {}
