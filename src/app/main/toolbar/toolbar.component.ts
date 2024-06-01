import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { GlobalVarialblesService } from '../../Core/Services/globalVarialbles/global-varialbles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  logo: any;
  companyService: any;

  companyUUID: any = null;
  companyName: any = null;

  constructor(private router: Router,
              private globalVariablesService: GlobalVarialblesService){}

  ngOnInit(): void {

    this.globalVariablesService.companyUUID.subscribe( (uuid: any) => {
      this.companyUUID = uuid == '' || uuid == null ? null : uuid;
      console.log(uuid);
      console.log(this.companyUUID);
      this.items = [];
      this.getMenuItems();
    } )

    this.globalVariablesService.companyName.subscribe( (name: any) => {
        this.companyName = name == '' || name == null ? null : name;
        console.log(name);
        console.log(this.companyName);
      } )
  
  }

  getMenuItems() {
    // Define top-level items
    const topLevelItems: MenuItem[] = [
        {
            label: 'Home',
            icon: 'pi pi-custom-home',
            styleClass: 'custom-item',
            routerLink: '/companies',
            visible: true,
            items: [] // Placeholder for child items
        },
        {
            label: 'Emails Lists',
            icon: 'pi pi-emails',
            command: () => this.router.navigateByUrl('/companies/emails-list'),
            visible: true,
            items: [
                {  
                    label: 'Manage Categories',
                    icon: 'pi pi-categories',
                    command: () => this.router.navigateByUrl('/companies/emails-list/emails-categories'),
                    visible: true
                },
                {  
                    label: 'Manage Emails',
                    icon: 'pi pi-manage-emails',
                    command: () => this.router.navigateByUrl('/companies/emails-list/emails'),
                    visible: true
                }
            ]
        }
    ];

    // Define child items
    const childItems: MenuItem[] = [
        {
            label: 'ShowCase',
            icon: 'pi pi-showcase',
            routerLink: '/companies/showcase/company-showcase'
        },
        {
            label: 'Manage Your Network',
            icon: 'pi pi-network',
            routerLink: '/companies/showcase/connection-details',
            routerLinkActive: 'active-link',
            pRipple: true
        },
        {
            label: 'Business Card',
            icon: 'pi pi-business-card',
            routerLink: '/companies/showcase/business-card',
            routerLinkActive: 'active-link',
            pRipple: true
        },
        {
            label: 'Social Media Accounts',
            icon: 'pi pi-social-media-accounts',
            badge: '3',
            routerLink: '/companies/showcase/social-media-accounts'
        }
    ];

    // Set child items as sub-items of Home item
    topLevelItems[0].items = childItems.map(item => {
        return {
            ...item,
            visible: !!this.companyUUID,
            command: () => this.router.navigateByUrl(item.routerLink || '')
        };
    });

    topLevelItems[0].items.unshift({
      label: 'Home',
      icon: 'pi pi-custom-home',
      styleClass: 'custom-item',
      command: () => this.router.navigateByUrl('/companies'),
      visible: true,
    },)

    // Set menu items
    this.items = topLevelItems;
}


logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to log out.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log me out!'
    }).then((result: any) => {
        if (result.isConfirmed) {
            localStorage.removeItem("token");
            localStorage.removeItem("crnt_cmp");
            this.globalVariablesService.companyUUID.next(null);
            this.globalVariablesService.companyName.next(null);
            this.globalVariablesService.companyIMAGE.next(null);
            this.router.navigateByUrl("/auth/login");
        }
    });
}



}
