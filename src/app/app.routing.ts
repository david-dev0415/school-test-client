import { RouterModule, Routes } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home.component';
import { TestBoardComponent } from './components/test-board/test-board.component';
import { LoginFormComponent } from './components/shared/login-form/login-form.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { QuestionHomepageComponent } from './components/question-homepage/question-homepage.component';
import { QuestionUpdateComponent } from './components/question-update/question-update.component';
import { QuestionSectionComponent } from './components/question-section/question-section.component';

// Guard
import { AuthGuard } from './guards/auth.guard';
import { AuthStudentGuard } from './guards/auth-student.guard';


const APP_ROUTES: Routes = [
  {
    path: 'index',
    component: LoginFormComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'groups',
    component: TestBoardComponent,
    canActivate: [AuthGuard],    
  },
  {
    path: 'groups/detail/:id',
    component: GroupDetailsComponent,   
    canActivate: [AuthGuard]
  },
  {
    path: 'groups/detail/:id/question/:id',
    component: QuestionUpdateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'question-homepage',
    component: QuestionHomepageComponent,
    canActivate: [AuthStudentGuard]
  },
  {
    path: 'group/:id/question-section',
    component: QuestionSectionComponent,
    canActivate: [AuthStudentGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'index'
  }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES)