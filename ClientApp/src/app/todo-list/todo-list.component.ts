import { Component, OnInit } from '@angular/core';
import { ToDoItem, ToDoService } from '../services/todo.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgFor } from '@angular/common';
import { AddToDoComponent } from '../add-todo/add-todo.component';
import { MatListModule, MatList, MatListItem } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [AsyncPipe, 
    NgFor,
    NgClass, 
    AddToDoComponent,
    MatListModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
    MatListItem,
    MatList],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class ToDoListComponent implements OnInit {
  toDo$: Observable<ToDoItem[]>;

  constructor(private toDoService: ToDoService) {
    this.toDo$ = this.toDoService.toDo$;
  }

  ngOnInit(): void {
    this.toDoService.loadToDo();
  }

  toggleComplete(toDo: ToDoItem): void {
    const updatedToDo = { ...toDo, isCompleted: !toDo.isCompleted };
    this.toDoService.updateToDo(updatedToDo).subscribe();
  }

  deleteToDo(id: number): void {
    this.toDoService.deleteToDo(id).subscribe();
  }
}
