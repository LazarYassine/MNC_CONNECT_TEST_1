import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalVarialblesService } from '../../Core/Services/globalVarialbles/global-varialbles.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent implements OnInit, OnDestroy {
  
  sidebarVisible: boolean = false;
  
  constructor(private router: Router){}
  
  ngOnInit(): void {
    if (localStorage.getItem("crnt_cmp") == null) {
      Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'It seems there was a problem. Please select your company again.',
      }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
              this.router.navigateByUrl('/companies');
          }
      });
    }
  
  }

  viewServicesDescription() {
    throw new Error('Method not implemented.');
  }
  sendEmailInvitation() {
    throw new Error('Method not implemented.');
  }
  uploadPortfolioImage() {
    throw new Error('Method not implemented.');
  }
  addContactInformation() {
    throw new Error('Method not implemented.');
  }
  addWebsiteLink() {
    throw new Error('Method not implemented.');
  }
  uploadBusinessCard() {
    throw new Error('Method not implemented.');
  }

  items: any[] = [
    { icon: 'pi pi-image', label: 'Upload Business Card', command: () => this.uploadBusinessCard() },
    { icon: 'pi pi-globe', label: 'Add Website Link', command: () => this.addWebsiteLink() },
    { icon: 'pi pi-user-plus', label: 'Add Contact Information', command: () => this.addContactInformation() },
    { icon: 'pi pi-camera', label: 'Upload Portfolio Image', command: () => this.uploadPortfolioImage() },
    { icon: 'pi pi-list', label: 'View Services Description', command: () => this.viewServicesDescription() },
    { icon: 'pi pi-envelope', label: 'Send Email Invitation', command: () => this.sendEmailInvitation() }
  ];


  ngOnDestroy(){
  }


}
