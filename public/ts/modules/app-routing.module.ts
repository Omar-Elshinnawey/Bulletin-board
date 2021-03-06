import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent, GroupComponent, NotesComponent} from '../components';
import {RegisterService} from '../services';

const routes: Routes = [
  { path: 'register', component: RegisterComponent},
  { path: 'groups', component: GroupComponent, canActivate:[RegisterService]},
  { path: 'notes', component: NotesComponent, canActivate: [RegisterService]},
  { path: '', redirectTo: 'register', pathMatch: 'full'}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }