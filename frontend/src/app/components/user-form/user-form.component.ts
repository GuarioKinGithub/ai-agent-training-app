import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersStore } from '../../store/users.store';
import type { CreateUser } from '@ai-agent-training/shared';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private usersStore = inject(UsersStore);

  public isSubmitting = false;

  public userForm: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    email: ['', [Validators.required, Validators.email]],
  });

  public getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }
    if (control?.hasError('minlength')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } must be at least 2 characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } must be less than 100 characters`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  public async onSubmit(): Promise<void> {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      try {
        const userData: CreateUser = this.userForm.value;
        await this.usersStore.createUser(userData);
        this.userForm.reset();
      } catch (error) {
        console.error('Error creating user:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}