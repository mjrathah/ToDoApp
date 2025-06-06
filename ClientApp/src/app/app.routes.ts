import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToDoListComponent } from './todo-list/todo-list.component';
import { AddToDoComponent } from './add-todo/add-todo.component';

export const routes: Routes = [
  { path: '', component: ToDoListComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
