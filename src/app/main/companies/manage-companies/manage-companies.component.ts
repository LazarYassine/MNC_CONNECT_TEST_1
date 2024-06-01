// manage-companies.component.ts
import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../Core/Services/company/company.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../Core/Services/auth/auth.service';

@Component({
  selector: 'app-manage-companies',
  templateUrl: './manage-companies.component.html',
  styleUrls: ['./manage-companies.component.scss']
})
export class ManageCompaniesComponent implements OnInit {
  companySizeOptions: any[] = [
    { label: '1-10 employees', value: '1-10' },
    { label: '11-50 employees', value: '11-50' },
    { label: '51-200 employees', value: '51-200' },
    { label: '201-500 employees', value: '201-500' },
    { label: '501+ employees', value: '501+' }
  ];

  companyId: any;
  userId: any;
  companyName: any;
  industry: any;
  location: any;
  foundedYear: any;
  companySize: any;
  description: any;
  contactEmail: any;
  logoURL: any;
  websiteURL: any;

  // change it with connected user id 
  UserID: any = null;

  isUpdateMode: boolean = false;

  constructor(private companyService: CompanyService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private authService: AuthService) { }


  ngOnInit(): void {
    if( localStorage.getItem("token") != null && this.authService.getUserIdFromToken() != null ){
      this.UserID = this.authService.getUserIdFromToken();
    }else {
      this.router.navigateByUrl("login");
    }
    this.companyId = this.activeRoute.snapshot.paramMap.get("id");
    if( this.companyId ){
      this.isUpdateMode = true;
      this.getCompanyById(this.companyId);
    }
  }

  getCompanyById(id: any){
    this.companyService.getCompanyById(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.companyId = data[0]?.CompanyID ?? null;
        this.userId = data[0]?.UserID ?? null;
        this.companyName = data[0]?.CompanyName ?? null;
        this.industry = data[0]?.Industry ?? null;
        this.location = data[0]?.Location ?? null;
        this.foundedYear = data[0]?.FoundedYear ?? null;
        this.companySize = data[0]?.Size ?? null;
        this.description = data[0]?.Description ?? null;
        this.contactEmail = data[0]?.contactEmail ?? null;
        this.logoURL = data[0]?.LogoURL ?? null;
        this.websiteURL = data[0]?.WebsiteURL ?? null;
      },
      error: (err: Error) => {
        console.error(err);
      }
    })
  }


  saveCompany() {
    // Check if important fields are filled
    if (!this.companyName || !this.industry || !this.foundedYear || !this.contactEmail || !this.companySize) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required fields',
      });
      return;
    }

    const companyData = {
      companyName: this.companyName,
      industry: this.industry,
      location: this.location,
      foundedYear: this.foundedYear,
      size: this.companySize,
      description: this.description,
      contactEmail: this.contactEmail,
      UserID: this.UserID
    };

    if(!this.isUpdateMode){
      this.companyService.createCompany(companyData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Company added successfully!',
          });
          console.log('Company added successfully:', response);
          // Reset form or redirect to another page after successful addition
          this.router.navigateByUrl("/companies/search-campanies");
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add company. Please try again later.',
          });
          console.error('Error adding company:', error);
          // Handle error
        }
      );
    }else {
      this.companyService.updateCompany(this.companyId, companyData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Company updated successfully!',
          });
          console.log('Company updated successfully:', response);
          // Reset form or redirect to another page after successful addition
          this.router.navigateByUrl("/companies/search-campanies");
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update company. Please try again later.',
          });
          console.error('Error updating company:', error);
          // Handle error
        }
      );
    }
    
  }

  Initilize(){
    if(this.isUpdateMode) {
      this.getCompanyById(this.companyId);
    }else {
      this.companyId = null;
      this.userId = null;
      this.companyName = null;
      this.industry = null;
      this.location = null;
      this.foundedYear = null;
      this.companySize = null;
      this.description = null;
      this.contactEmail = null;
      this.logoURL = null;
      this.websiteURL = null;
    }
  }

  cancel(){
    this.router.navigateByUrl("/companies/search-campanies");
  }

}
