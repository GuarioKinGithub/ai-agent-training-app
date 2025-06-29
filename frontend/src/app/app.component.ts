import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersStore } from './store/users.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    UserFormComponent,
    UserListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public title = 'AI Agent Training';
  public subtitle = 'User Management Demo';
  public usersStore = inject(UsersStore);
  private snackBar = inject(MatSnackBar);

  public ngOnInit(): void {
    this.usersStore.loadUsers();
  }

  public clearError(): void {
    this.usersStore.clearError();
    this.snackBar.open('Error cleared', 'Close', {
      duration: 2000,
    });
  }
}
