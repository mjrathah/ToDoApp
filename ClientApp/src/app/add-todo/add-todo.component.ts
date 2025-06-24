import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToDoService } from '../services/todo.service';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatLabel
  ]
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