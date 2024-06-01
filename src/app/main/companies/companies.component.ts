import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyService } from '../../Core/Services/company/company.service';
import { Subscription } from 'rxjs';
import { GlobalVarialblesService } from '../../Core/Services/globalVarialbles/global-varialbles.service';
import Swal from 'sweetalert2';
import { UsersService } from '../../Core/Services/users/users.service';
import { AuthService } from '../../Core/Services/auth/auth.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit, OnDestroy {

  companyImage: string | null = null;
  companyImageSubscription: Subscription | undefined;
  companyUUIDSubscription: Subscription | undefined;
  companyNameSubscription: Subscription | undefined;
  companyUUID: any = null;
  companyName: any = null;

  constructor(
    private globalVariablesService: GlobalVarialblesService,
    private companyService: CompanyService,
    private userService: UsersService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUserSubscriptionDetailsByUserId();  
    // this.companyUUID = localStorage.getItem("crnt_cmp");
    // console.log("companyUUID ==> ", this.companyUUID);
    // this.globalVariablesService.companyUUID.subscribe( (value: any) => {
    //   if(value == null) {
    //     this.globalVariablesService.companyIMAGE.next(null);
    //   }
    //   this.companyUUID = value;
    // } )
    
    // Subscribe to changes in companyIMAGE
    this.companyImageSubscription = this.globalVariablesService.companyIMAGE.subscribe((imageUrl: string) => {
      this.companyImage = this.companyService.getCompanyImage(imageUrl);
    });

    this.companyNameSubscription = this.globalVariablesService.companyName.subscribe((companyName: string) => {
      this.companyName = companyName == '' || companyName == null ? null : companyName;
    });
    // Subscribe to changes in companyUUID
    this.companyUUIDSubscription = this.globalVariablesService.companyUUID.subscribe((uuid: any) => {
      this.companyUUID = uuid == '' || uuid == null ? null : uuid;
      // console.log(this.companyUUID);
      if(uuid === null){
        this.globalVariablesService.companyIMAGE.next(null);
        this.globalVariablesService.companyName.next(null);
      }
    });

    // Initial retrieval of company image
    this.getCompanyImage();
  }

  getUserSubscriptionDetailsByUserId(){
    this.userService.getUserSubscriptionDetailsByUserId(this.authService.getUserIdFromToken()).subscribe({
      next: (data: any) => {
        console.log("subscreption details ==> ", data);
        this.globalVariablesService.subscriptionDetails.next(data);
      },
      error: (error: Error) => {
        console.error(error);
      }
    })
  }

  ngOnDestroy(): void {
    // Unsubscribe from the subscription to prevent memory leaks
    if (this.companyImageSubscription) {
      this.companyImageSubscription.unsubscribe();
    }
    if(this.companyUUIDSubscription) {
      this.companyUUIDSubscription.unsubscribe();
    }
    if(this.companyNameSubscription){
      this.companyNameSubscription.unsubscribe();
    }
  }

  getCompanyImage(): void {
    // Retrieve the company image from the service
    this.companyService.getCompanyImage(this.companyImage);
  }
}
