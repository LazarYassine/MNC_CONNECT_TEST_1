import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../../../Core/Services/company/company.service';
import { GlobalVarialblesService } from '../../../Core/Services/globalVarialbles/global-varialbles.service';
import { AuthService } from '../../../Core/Services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-companies',
  templateUrl: './search-companies.component.html',
  styleUrl: './search-companies.component.scss'
})
export class SearchCompaniesComponent implements OnInit {

  companies: any[]= [];
  url_prefix: any = "http://localhost:4200/cmp-profile/"; 
  url: any = null; // Replace with your destination URL

  isQrCodeDialogVisible: boolean = false;

  maxNumberOfCompanies: any = 0;
  NumberOfCompanies: any = 0;
  constructor(
              private router: Router,
              private companyService: CompanyService,
              private globalVarialblesService: GlobalVarialblesService,
              private authService: AuthService){}
  ngOnInit(): void {
    this.globalVarialblesService.subscriptionDetails.subscribe({
      next: (data: any) => {
        const accountsFeature = data?.find((item: any) => item.FeatureName === "Accounts");
        this.maxNumberOfCompanies = accountsFeature ? accountsFeature.LimitValue : null;
        // console.log("maxNumberOfCompanies ==> ", this.maxNumberOfCompanies);
      },
      error: (err: Error) => {
        console.error("Error fetching subscription details", err);
      }
    });
    
    this.getAllCompanies();
  }

  goToAddCompany(){
    this.router.navigateByUrl("/companies/manage-campanies")
  }

  getAllCompanies(){
    this.companyService.getAllCompanies(this.authService.getUserIdFromToken()).subscribe({
      next: (data: any) => {
        this.companies = data;
        this.NumberOfCompanies = this.companies.length;
      },
      error: (error: Error) => {
        console.log(error);
      }
    })
  }

  goToEditCompany(item: any) {
    console.log(item);
    this.router.navigateByUrl("/companies/manage-campanies/"+item?.CompanyID);
  }

  goManageShowCase(company: any) {
    // console.log(company);
    // this.localStorageService.setItem('companyId', companyId); // Store companyId in localStorage
    localStorage.setItem("crnt_cmp",company?.uuid)
    this.globalVarialblesService.companyUUID.next(company?.uuid);
    this.globalVarialblesService.companyIMAGE.next(company?.LogoURL);
    this.globalVarialblesService.companyName.next(company?.CompanyName);
    this.router.navigateByUrl("/companies/showcase/company-showcase");
  }

  generateTheQrCode(company: any) {
    if (!company || !company.uuid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'We encountered an issue. Unable to generate the QR code because the company information is incomplete.',
        footer: 'Please try again or contact support if the problem persists.',
      });
      return;
    }

    this.url = this.url_prefix + company.uuid;
    this.isQrCodeDialogVisible = true;

    Swal.fire({
      icon: 'success',
      title: 'QR Code Ready!',
      text: 'Your QR code has been successfully generated. You can now share it with others!',
      footer: 'Thank you for using our service.',
    });
  }

  
  deleteCompany(company: any) {
      Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
          if (result.isConfirmed) {
              this.companyService.deleteCompany(company?.uuid).subscribe({
                  next: () => {
                      Swal.fire(
                          'Deleted!',
                          'The company has been deleted.',
                          'success'
                      );
                      this.getAllCompanies();
                      this.globalVarialblesService.companyName.next(null);
                      this.globalVarialblesService.companyIMAGE.next(null);
                      this.globalVarialblesService.companyUUID.next(null);
                  },
                  error: (err: Error) => {
                      console.error('Error:', err);
                      Swal.fire(
                          'Error!',
                          'There was an error deleting the company.',
                          'error'
                      );
                  },
                  complete: () => {
                      // Optional: Add any code that you want to execute when the observable completes
                  }
              });
          }
      });
  }


}
