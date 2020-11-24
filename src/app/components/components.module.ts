import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


import { LoginFormComponent } from './shared/login-form/login-form.component';
import { QuestionComponent } from './question/question.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { TestBoardComponent } from './test-board/test-board.component';
import { NavbarBrandComponent } from './shared/navbar-brand/navbar-brand.component';
import { QuestionHomepageComponent } from './question-homepage/question-homepage.component';
import { PrincipalCardComponent } from './shared/principal-card/principal-card.component';
import { CardGroupComponent } from './shared/card-group/card-group.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { LoadingSpinnerComponent } from './shared/ui/loading-spinner/loading-spinner.component';
import { QuestionCardComponent } from './shared/question-card/question-card.component';
import { QuestionUpdateComponent } from './question-update/question-update.component';
import { QuestionSectionComponent } from './question-section/question-section.component';
import { ReplyFormComponent } from './reply-form/reply-form.component';

@NgModule({
  declarations: [
    LoginFormComponent,
    QuestionComponent,
    HomeComponent,
    NavbarComponent,
    TestBoardComponent,
    NavbarBrandComponent,
    QuestionHomepageComponent,
    PrincipalCardComponent,
    CardGroupComponent,
    GroupDetailsComponent,
    LoadingSpinnerComponent,
    QuestionCardComponent,
    QuestionUpdateComponent,
    QuestionSectionComponent,
    ReplyFormComponent    
  ],
  exports: [
    LoginFormComponent,
    QuestionComponent,
    HomeComponent,
    NavbarComponent,
    QuestionHomepageComponent,
    TestBoardComponent,
    GroupDetailsComponent,
    PrincipalCardComponent,
    QuestionCardComponent,
    QuestionUpdateComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
 
})
export class ComponentsModule { }
