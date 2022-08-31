import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { MovieManagementComponent } from './components/movie-management/movie-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import {NgxPaginationModule} from 'ngx-pagination';
import { ReviewManagementComponent } from './components/review-management/review-management.component';
import { ActorManagmentComponent } from './components/actor-managment/actor-managment.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';




@NgModule({
  declarations: [
    UserManagementComponent,
    MovieManagementComponent,
    ReviewManagementComponent,
    ActorManagmentComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
  ],
  exports: [
    UserManagementComponent,
    MovieManagementComponent,
    ReviewManagementComponent,
    ActorManagmentComponent
  ]
})
export class AdminModule { }
