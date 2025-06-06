import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToDoService } from '../services/todo.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf]
})
export class AddToDoComponent {
  toDoForm!: FormGroup;

  constructor(private fb: FormBuilder, private toDoService: ToDoService) {
    this.createForm();
  }

  createForm() {
    this.toDoForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isCompleted: [false]
    });
  }

  onSubmit(): void {
    if (this.toDoForm.valid) {
      const formValue = this.toDoForm.value;
      const toDo = {
        title: formValue.title ?? '',
        description: formValue.description ?? '',
        isCompleted: formValue.isCompleted ?? false,
        createdDate: new Date().toISOString()
      };
      this.toDoService.createToDo(toDo).subscribe(() => {
        this.toDoForm.reset({ isCompleted: false });
      });
    }
  }
}
