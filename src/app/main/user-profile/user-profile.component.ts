import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsersService } from '../../Core/Services/users/users.service';
import { AuthService } from '../../Core/Services/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private usersService: UsersService,
              private authService: AuthService
  ){}

  ngOnInit(): void {
    this.getUserInfos();
  }

  getUserInfos(){
    this.usersService.getUserById(this.authService.getUserIdFromToken()).subscribe({
      next: (data: any) => {
        console.log(data);
        this.email = data?.Email;
        this.username = data?.Username;
      },
      error: (err: Error) => {
        console.error(err);
      }
    })
  }

  onSaveChanges() {
    if (!this.validateForm()) {
        return;
    }

    let reqBody = {
        userId: this.authService.getUserIdFromToken(),
        email: this.email,
        username: this.username,
        password: this.password
    };

    this.usersService.updateUser(reqBody).subscribe(
        (response) => {
            // Success response
            console.log('Update success:', response);
            Swal.fire({
                title: 'Success',
                text: 'Your profile has been updated!',
                icon: 'success'
            });
        },
        (error) => {
            // Error response
            console.error('Update error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update profile. Please try again later.',
                icon: 'error'
            });
        }
    );
}

  validateForm(): boolean {
    if (!this.username || !this.email) {
      Swal.fire('Error', 'Username and Email are required', 'error');
      return false;
    }

    if (!this.password || !this.confirmPassword) {
      Swal.fire('Error', 'Password and Confirmation Password are required', 'error');
      return false;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return false;
    }

    // Additional password validation can be added here

    return true;
  }

  initializeForm() {
    this.getUserInfos();
    this.password = '';
    this.confirmPassword = '';
    Swal.fire('Form Initialized', 'The form has been reset.', 'info');
  }
}
