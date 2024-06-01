// import { Component, HostListener, OnInit } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';
// import { GlobalVarialblesService } from './Core/Services/globalVarialbles/global-varialbles.service';
// import { environment } from '../environments/environment';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })
// export class AppComponent implements OnInit {
//   title = 'MNBConnect';


//   constructor(private cookieService: CookieService,
//               private globalVarialblesService: GlobalVarialblesService) {}
//   ngOnInit(): void {
//     console.log(environment.production); // Outputs 'true' or 'false' based on the environment
//     console.log(environment.apiUrl); // Outputs the API URL
//   }

//   @HostListener('window:beforeunload', ['$event'])
//   beforeUnloadHandler(event: Event) {
//     // Store UUID and image name in cookies before page reload
//     if( localStorage.getItem('crnt_cmp') != null ){
//       this.globalVarialblesService.companyUUID.subscribe( value => {
//         this.cookieService.set('uuid', value);
//       } ); // Replace with actual UUID
//       this.globalVarialblesService.companyName.subscribe( value => {
//         this.cookieService.set('cmpName', value);
//       } ); // Replace with actual UUID
//       this.globalVarialblesService.companyIMAGE.subscribe( value => {
//         this.cookieService.set('imageName', value);
//       } );  // Replace with actual image name
//     }else {
//       this.globalVarialblesService.companyUUID.next(null);
//       this.globalVarialblesService.companyIMAGE.next(null);
//       this.globalVarialblesService.companyName.next(null);
//     }
    
//   }

//   @HostListener('window:load', ['$event'])
//   onLoadHandler(event: Event) {
//     // Retrieve UUID and image name from cookies after page reload
//     this.globalVarialblesService.companyUUID.next(this.cookieService.get('uuid'));
//     this.globalVarialblesService.companyIMAGE.next(this.cookieService.get('imageName'));
//     this.globalVarialblesService.companyName.next(this.cookieService.get('cmpName'));
//      // Remove the data from cookies
//     this.cookieService.delete('uuid');
//     this.cookieService.delete('imageName');
//     this.cookieService.delete('cmpName');
//     // Do something with the retrieved UUID and image name
//   }



// }


import { Component, HostListener, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GlobalVarialblesService } from './Core/Services/globalVarialbles/global-varialbles.service';
import { environment } from '../environments/environment';
import { UsersService } from './Core/Services/users/users.service';
import { AuthService } from './Core/Services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Note the correct property name is `styleUrls`
})
export class AppComponent implements OnInit {
  title = 'MNBConnect';

  constructor(private cookieService: CookieService,
              private globalVarialblesService: GlobalVarialblesService) {}

  ngOnInit(): void {
    console.log(environment.production); // Outputs 'true' or 'false' based on the environment
    console.log(environment.apiUrl); // Outputs the API URL
  }

  

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event): void {
    // Store UUID and image name in cookies before page reload
    if (localStorage.getItem('crnt_cmp') != null) {
      this.globalVarialblesService.companyUUID.subscribe(value => {
        this.cookieService.set('uuid', value);
      }); // Replace with actual UUID
      this.globalVarialblesService.companyName.subscribe(value => {
        this.cookieService.set('cmpName', value);
      }); // Replace with actual UUID
      this.globalVarialblesService.companyIMAGE.subscribe(value => {
        this.cookieService.set('imageName', value);
      }); // Replace with actual image name
    } else {
      this.globalVarialblesService.companyUUID.next(null);
      this.globalVarialblesService.companyIMAGE.next(null);
      this.globalVarialblesService.companyName.next(null);
    }
  }

  @HostListener('window:load', ['$event'])
  onLoadHandler(event: Event): void {
    // Retrieve UUID and image name from cookies after page reload
    const uuid = this.cookieService.get('uuid');
    const imageName = this.cookieService.get('imageName');
    const cmpName = this.cookieService.get('cmpName');

    this.globalVarialblesService.companyUUID.next(uuid || null);
    this.globalVarialblesService.companyIMAGE.next(imageName || null);
    this.globalVarialblesService.companyName.next(cmpName || null);

    // Remove the data from cookies
    this.cookieService.delete('uuid');
    this.cookieService.delete('imageName');
    this.cookieService.delete('cmpName');

    // Do something with the retrieved UUID and image name
  }
}
