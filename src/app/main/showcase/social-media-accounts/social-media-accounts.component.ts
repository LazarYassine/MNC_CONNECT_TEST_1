import { Component, OnInit } from '@angular/core';
import { SocialMediaPlatform } from '../../../Core/Enums/SocialMediaPlatform';
import Swal from 'sweetalert2';
import { SocialMediaService } from '../../../Core/Services/SocialMedia/social-media.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-social-media-accounts',
  templateUrl: './social-media-accounts.component.html',
  styleUrls: ['./social-media-accounts.component.scss']
})
export class SocialMediaAccountsComponent implements OnInit {

  selectedPlatform: any = null;
  accountName: string = '';
  accountLink: string = '';
  platforms = [
    { label: 'Facebook', value: SocialMediaPlatform.Facebook },
    { label: 'Instagram', value: SocialMediaPlatform.Instagram },
    { label: 'LinkedIn', value: SocialMediaPlatform.LinkedIn },
    { label: 'Twitter', value: SocialMediaPlatform.Twitter },
    { label: 'YouTube', value: SocialMediaPlatform.YouTube },
    { label: 'Pinterest', value: SocialMediaPlatform.Pinterest },
    { label: 'Snapchat', value: SocialMediaPlatform.Snapchat },
    { label: 'TikTok', value: SocialMediaPlatform.TikTok },
    { label: 'WhatsApp', value: SocialMediaPlatform.WhatsApp },
    { label: 'Reddit', value: SocialMediaPlatform.Reddit }
  ];
  companyUUID: any = null;
  accounts: any[] = [];

  updateMode = false;
  accountId: any = null;

  constructor(private socialMediaService: SocialMediaService,
              private router: Router) {}

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
    }else {
      this.companyUUID = localStorage.getItem("crnt_cmp");
      this.getAllSocialMediaAccounts();
    }
  }

  saveSocialMediaAccount() {
    if (!this.accountName || !this.accountLink || !this.selectedPlatform) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please fill in all required fields',
        });
        return;
    }

    const accountData = {
        accountName: this.accountName,
        accountLink: this.accountLink,
        platform: this.selectedPlatform.value
    };

    if (this.updateMode === false) {
        // Create mode
        this.socialMediaService.createSocialMediaAccount(this.companyUUID, accountData).subscribe(
            () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Social media account added successfully!',
                });
                // Reset form or redirect to another page after successful addition
                this.initializeForm();
                this.getAllSocialMediaAccounts();
            },
            (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to add social media account. Please try again later.',
                });
                console.error('Error adding social media account:', error);
                // Handle error
            }
        );
    } else {
        // Update mode
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to update the social media account. Are you sure you want to proceed?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.socialMediaService.updateSocialMediaAccount(this.companyUUID, this.accountId, accountData).subscribe(
                    () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Social media account updated successfully!',
                        });
                        // Reset form or redirect to another page after successful update
                        this.initializeForm();
                        this.getAllSocialMediaAccounts();
                        // Reset update mode
                        this.updateMode = false;
                        this.accountId = null;
                    },
                    (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to update social media account. Please try again later.',
                        });
                        console.error('Error updating social media account:', error);
                        // Handle error
                    }
                );
            }
        });
    }
}


  initializeForm() {
    this.selectedPlatform = null;
    this.accountName = '';
    this.accountLink = '';
    this.updateMode = false;
  }

  cancel() {
    this.router.navigateByUrl('/companies');
  }

  getAllSocialMediaAccounts(){
    this.socialMediaService.getAllSocialMediaAccounts(this.companyUUID).subscribe({
      next: (data: any) => {
        this.accounts = data;
        console.log("accounts ==> ", this.accounts);
      },
      error: (err: Error) => {
        console.error(err);
      }
    })
  }

  editAccount(account: any) {
    console.log("Platforms:", this.platforms);
    console.log("Account:", account);
    this.selectedPlatform = this.platforms?.find((item: any) =>
        item?.value?.toLowerCase() === account?.platform?.toLowerCase()
    );
    console.log("Selected Platform:", this.selectedPlatform);

    // Set the account name and link based on the account data
    this.accountName = account?.account_name || null;
    this.accountLink = account?.account_url || null;
    this.updateMode = true;
    this.accountId = account?.id;
  }

  deleteSocialMediaAccount(accountId: string) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this social media account. This action cannot be undone. Are you sure you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // User confirmed the deletion, proceed with the delete request
            this.socialMediaService.deleteSocialMediaAccount(this.companyUUID, accountId).subscribe(
                () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Social media account deleted successfully!',
                    });
                    // Optionally, refresh the list of social media accounts after deletion
                    this.getAllSocialMediaAccounts();
                },
                (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete social media account. Please try again later.',
                    });
                    console.error('Error deleting social media account:', error);
                    // Handle error
                }
            );
        }
    });
}


}
