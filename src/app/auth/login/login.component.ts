import { Component } from '@angular/core';
import { AuthService } from '../../Core/Services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,
              private router: Router) {}

  login() {
    // Validate if all fields are filled
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill in all fields.',
      });
      return;
    }

    // Perform login
    this.authService.loginUser(this.email, this.password).subscribe(
      (response: any) => {
        // Handle successful login
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Login successful!',
        });
        // Navigate to the desired page after login, for example:
        // this.router.navigateByUrl("/dashboard");
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token);
        this.router.navigateByUrl("/companies");
        
      },
      (error: any) => {
        // Handle login error
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Login failed. Please check your credentials and try again.',
        });
        console.error('Login failed:', error);
      }
    );
  }
}
