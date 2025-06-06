import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ToDoItem {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  private baseUrl = environment.apiUrl || '';
  private apiUrl = this.baseUrl + '/api/todo';
  private toDoSubject = new BehaviorSubject<ToDoItem[]>([]);
  toDo$ = this.toDoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadToDo();
  }

  loadToDo(): void {
    this.http.get<ToDoItem[]>(this.apiUrl).subscribe(item => {
      this.toDoSubject.next(item);
    });
  }

  getTodo(id: number): Observable<ToDoItem> {
    return this.http.get<ToDoItem>(`${this.apiUrl}/${id}`);
  }

  createToDo(toDo: Omit<ToDoItem, 'id'>): Observable<ToDoItem> {
    return this.http.post<ToDoItem>(this.apiUrl, toDo).pipe(
      map(newItem => {
        const currentToDos = this.toDoSubject.value;
        this.toDoSubject.next([...currentToDos, newItem]);
        return newItem;
      })
    );
  }

  updateToDo(toDo: ToDoItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${toDo.id}`, toDo).pipe(
      map(() => {
        const currentToDo = this.toDoSubject.value;
        const updatedToDo = currentToDo.map(item => 
          item.id === toDo.id ? toDo : item
        );
        this.toDoSubject.next(updatedToDo);
      })
    );
  }

  deleteToDo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        const currentToDo = this.toDoSubject.value;
        const updatedToDo = currentToDo.filter(item => item.id !== id);
        this.toDoSubject.next(updatedToDo);
      })
    );
  }
}
