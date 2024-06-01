import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BusinessCardService } from '../../../Core/Services/BusinessCard/business-card.service';
import Swal from 'sweetalert2';
import { Constants } from '../../../Core/constants';
import { GlobalVarialblesService } from '../../../Core/Services/globalVarialbles/global-varialbles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-card',
  templateUrl: './business-card.component.html',
  styleUrls: ['./business-card.component.scss'],
  animations: [
    trigger('flipAnimation', [
      state('front', style({ transform: 'rotateY(0deg)' })),
      state('back', style({ transform: 'rotateY(180deg)' })),
      transition('front => back', [
        animate('0.6s')
      ]),
      transition('back => front', [
        animate('0.6s')
      ])
    ])
  ]
})
export class BusinessCardComponent implements OnInit {
  BC_FRONT_SIDE: any = Constants.BUSINESS_CARD_FRONT_PLACE_HOLDER;
  BC_BACK_SIDE: any = Constants.BUSINESS_CARD_BACK_PLACE_HOLDER;
  BC_FRONT_SIDE_EDIT_MODE: any = Constants.BUSINESS_CARD_FRONT_PLACE_HOLDER;
  BC_BACK_SIDE_EDIT_MODE: any = Constants.BUSINESS_CARD_BACK_PLACE_HOLDER;

  selectedFileBCFrontSide: any;
  selectedFileBCBackSide: any;

  showEditModal: boolean = false;
  companyId: any = null; // Assuming companyId is predefined
  companyUUID: any = null;
  currentCard: any;

  cards: any[] = [];
  selectedFileBCFrontSideEditMode: any;
  selectedFileBCBackSideEditMode: any;

  maxNumberOfCompanies: any = 0;
  maxNumberOfCards: any = 0;
  numberOfCards: any = 0;

  constructor(private businessCardService: BusinessCardService,
              private router: Router,
              private globalVarialblesService: GlobalVarialblesService) {}

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
      this.globalVarialblesService.subscriptionDetails.subscribe({
        next: (data: any) => {
          console.log("Subscription details received:", data);
      
          const accountsFeature = data?.find((item: any) => item.FeatureName === "Accounts");
          this.maxNumberOfCompanies = accountsFeature ? accountsFeature.LimitValue : null;
          console.log("maxNumberOfCompanies ==> ", this.maxNumberOfCompanies);
      
          const cardsFeature = data?.find((item: any) => item.FeatureName === "Business Cards");
          this.maxNumberOfCards = cardsFeature ? (cardsFeature.LimitValue / this.maxNumberOfCompanies) : 0;
          console.log("maxNumberOfCards ==> ", this.maxNumberOfCards);
        },
        error: (err: Error) => {
          console.error("Error fetching subscription details", err);
        }
      });
      this.companyUUID = localStorage.getItem("crnt_cmp");
    }
    this.getAllCards();
  }

  toggleCard(card: any) {
    card.isFrontVisible = !card.isFrontVisible;
  }

  onFileChangeBCFrontSide(event: any) {
    this.selectedFileBCFrontSide = event.target.files[0];
    this.previewImageFrontSide();
  }

  previewImageFrontSide() {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.BC_FRONT_SIDE = e.target.result;
    };
    reader.readAsDataURL(this.selectedFileBCFrontSide);
  }

  onFileChangeBCBackSide(event: any) {
    this.selectedFileBCBackSide = event.target.files[0];
    this.previewImageBackSide();
  }

  previewImageBackSide() {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.BC_BACK_SIDE = e.target.result;
    };
    reader.readAsDataURL(this.selectedFileBCBackSide);
  }

  onSave() {
    const formData = new FormData();
    formData.append('companyUUID', this.companyUUID);
    formData.append('isActive', 'false'); // Set isActive to false by default

    if (this.selectedFileBCFrontSide) {
      formData.append('frontImage', this.selectedFileBCFrontSide);
    }

    if (this.selectedFileBCBackSide) {
      formData.append('backImage', this.selectedFileBCBackSide);
    }

    this.businessCardService.createBusinessCard(formData).subscribe(
      (response) => {
        Swal.fire('Success', 'Business card saved successfully', 'success');
        this.getAllCards(); // Refresh data after saving
      },
      (error) => {
        console.error('Error saving business card:', error);
        Swal.fire('Error', 'Failed to save business card', 'error');
      }
    );
  }

  getAllCards() {
    this.businessCardService.getAllBusinessCards(this.companyUUID).subscribe({
      next: (data: any[]) => {
        this.cards = data.map((item: any) => {
          // Construct image URLs based on frontImageURL and backImageURL filenames
          const frontImageUrl = item.FrontImageURL ? this.businessCardService.getBusinessCardsImage(item.FrontImageURL) : null;
          const backImageUrl = item.BackImageURL ? this.businessCardService.getBusinessCardsImage(item.BackImageURL) : null;
  
          return {
            ...item,
            frontImageUrl,
            backImageUrl,
            isFrontVisible: true
          };
        });
        this.numberOfCards = this.cards.length;
        // console.log("cards ==> ", this.cards)
      },
      error: (error) => {
        console.error('Error fetching business cards:', error);
        Swal.fire('Error', 'Failed to fetch business cards', 'error');
      }
    });
  }


onEditSave() {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to update this business card?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, update it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.updateCard();
    }
  });
}

updateCard() {
  const formData = new FormData();
  formData.append('companyUUID', this.companyUUID);
  formData.append('isActive', this.currentCard?.IsActive); // Set isActive to false by default

  if (this.selectedFileBCFrontSideEditMode) {
    formData.append('frontImage', this.selectedFileBCFrontSideEditMode);
  }

  if (this.selectedFileBCBackSideEditMode) {
    formData.append('backImage', this.selectedFileBCBackSideEditMode);
  }

  this.businessCardService.updateBusinessCard(this.currentCard?.CardID, formData).subscribe({
    next: () => {
      Swal.fire(
        'Updated!',
        'Business card has been updated.',
        'success'
      );
      this.getAllCards();
      this.showEditModal = false;
    },
    error: (err: Error) => {
      console.error(err);
      Swal.fire(
        'Error!',
        'Failed to update business card.',
        'error'
      );
    }
  });
}


  editCard(card: any) {
    this.currentCard = card;
    this.showEditModal = true;
    // Optionally, you can set default values for the file inputs based on the current card data
    this.BC_FRONT_SIDE_EDIT_MODE = card.frontImageUrl;
    this.BC_BACK_SIDE_EDIT_MODE = card.backImageUrl;
  }

  closeEditModal() {
    this.showEditModal = false;
    // Optionally, you can reset the file inputs and other modal-related properties here
  }


  onFileChangeBCFrontSideEditMode(event: any) {
    this.selectedFileBCFrontSideEditMode = event.target.files[0];
    this.previewImageFrontSideEditMode();
  }

  previewImageFrontSideEditMode() {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.BC_FRONT_SIDE_EDIT_MODE = e.target.result;
    };
    reader.readAsDataURL(this.selectedFileBCFrontSideEditMode);
  }

  onFileChangeBCBackSideEditMode(event: any) {
    this.selectedFileBCBackSideEditMode = event.target.files[0];
    this.previewImageBackSideEditMode();
  }

  previewImageBackSideEditMode() {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.BC_BACK_SIDE_EDIT_MODE = e.target.result;
    };
    reader.readAsDataURL(this.selectedFileBCBackSideEditMode);
  }

  deleteBusinessCard(card: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this business card?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.businessCardService.deleteBusinessCard(card?.CardID).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The business card has been deleted.',
              icon: 'success',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false
            });
            this.getAllCards();
          },
          error: (err: Error) => {
            console.error('Error deleting business card:', err);
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete the business card. Please try again later.',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }
  

changeCardStatus(card: any) {
  const isActive = card?.IsActive == '0' ? 'true' : 'false';
  const statusText = isActive === 'true' ? 'activate' : 'deactivate';

  Swal.fire({
    title: `Are you sure you want to ${statusText} this business card?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, proceed!',
    cancelButtonText: 'No, cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.businessCardService.changeCardStatus(card?.CardID, isActive).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: `Business card ${statusText}d successfully!`,
            showConfirmButton: false,
            timer: 1500
          });
          this.getAllCards();
        },
        error: (err: Error) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          });
        }
      });
    }
  });
}

  


}
