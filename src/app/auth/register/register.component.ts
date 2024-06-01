import { Component } from '@angular/core';
import { AuthService } from '../../Core/Services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UsersService } from '../../Core/Services/users/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private usersService: UsersService,
              private router: Router) {}

  register() {
    // Validate if all fields are filled
    if (!this.username || !this.email || !this.password) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill in all fields.',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    // Perform registration
    this.usersService.registerUser(this.username, this.email, this.password).subscribe(
      (response: any) => {
        // Handle successful registration
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Registration successful!',
        });
        // this.router.navigateByUrl("/pick-license")
        console.log('Registration successful:', response);
        this.router.navigateByUrl("/auth/login");
      },
      (error: any) => {
        // Handle registration error
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Registration failed. Please try again later.',
        });
        console.error('Registration failed:', error);
      }
    );
  }
}
