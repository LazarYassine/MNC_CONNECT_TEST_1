import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NetworkCategoryService } from '../../../Core/Services/NetworkCategory/network-category.service';
import { ContactService } from '../../../Core/Services/Contact/contact.service';
import { GlobalVarialblesService } from '../../../Core/Services/globalVarialbles/global-varialbles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connection-details',
  templateUrl: './connection-details.component.html',
  styleUrl: './connection-details.component.scss'
})
export class ConnectionDetailsComponent implements OnInit {

  // Sample category options
categoryOptions: any = [
  { label: 'Client', value: 'client' },
  { label: 'Supplier', value: 'supplier' },
  { label: 'Partner', value: 'partner' },
  { label: 'Lead', value: 'lead' }
];

  selectedColor: string = '#000000'; // Default color
  categoryName: string = '';
  categoryDesc: string = '';

  companyId: any = null;
  companyUUID: any = null;

  categories: any[] = [];
  categoryId: any;
  updateMode: boolean = false;

  
  //contacts fields
  contactName: any;
  contactEmail: any;
  contactPhone: any;
  selectedCategory: any;
  contactId: any;
  contacts: any[] = [];

  // apply licenses
  maxNumberOfCompanies: any = 0;
  maxNumberOfCategories: any = 0;
  numberOfCategories: any = 0;
  maxNumberOfContacts: any = 0;
  numberOfContacts: any = 0;

  constructor(private networkCategoryService: NetworkCategoryService,
              private contactsService: ContactService,
              private router: Router,
              private globalVarialblesService: GlobalVarialblesService) { }

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
      
          const networkCategoriesFeature = data?.find((item: any) => item.FeatureName === "Network Categories");
          this.maxNumberOfCategories = networkCategoriesFeature ? (networkCategoriesFeature.LimitValue / this.maxNumberOfCompanies) : 0;
          console.log("maxNumberOfCategories ==> ", this.maxNumberOfCategories);
      
           const contactsFeature = data?.find((item: any) => item.FeatureName === "Contacts");
           this.maxNumberOfContacts = contactsFeature ? (contactsFeature.LimitValue / this.maxNumberOfCompanies) : 0;
           console.log("maxNumberOfContacts ==> ", this.maxNumberOfContacts);
        },
        error: (err: Error) => {
          console.error("Error fetching subscription details", err);
        }
      });
      this.companyUUID = localStorage.getItem("crnt_cmp");
    }
    this.getAllCategories();
    this.getAllContacts();
  }

  saveCategory() {
    const categoryData: any = {
      name: this.categoryName,
      description: this.categoryDesc,
      borderColor: this.selectedColor
    };
  
    if (!this.isValidInput()) {
      Swal.fire('Error', 'Please enter valid category name and description', 'error');
      return;
    }
  
    if (this.updateMode) {
      this.networkCategoryService.updateCategory(this.companyUUID, this.categoryId, categoryData).subscribe({
        next: () => {
          Swal.fire('Success', 'Category updated successfully!', 'success');
          this.initializeForm();
          this.getAllCategories();
        },
        error: () => {
          Swal.fire('Error', 'Failed to update category', 'error');
        }
      });
    } else {
      this.networkCategoryService.createCategory(this.companyUUID, categoryData).subscribe({
        next: () => {
          Swal.fire('Success', 'Category saved successfully!', 'success');
          this.initializeForm();
          this.getAllCategories();
        },
        error: () => {
          Swal.fire('Error', 'Failed to save category', 'error');
        }
      });
    }
  }
  
  
  
  initializeForm() {
    this.categoryName = '';
    this.categoryDesc = '';
    this.selectedColor = '#000000';
    this.updateMode = false;
  }
  

  isValidInput(): boolean {
    // Perform validation logic here
    return this.categoryName.trim() !== '' && this.categoryDesc.trim() !== '';
  }

  getAllCategories(){
    this.networkCategoryService.getAllCategories(this.companyUUID).subscribe({
      next: (data: any) => {
        this.categories = data[0];
        this.numberOfCategories = this.categories.length;
        console.log("categories ==> ", this.categories);
      }
    })
  }

  editCategory(category: any){
    this.categoryName = category?.Name ? category?.Name : null;
    this.categoryDesc = category?.Description ? category?.Description : null;
    this.selectedColor = category?.BorderColor ? category?.BorderColor : null;
    this.categoryId = category?.CategoryID ? category?.CategoryID : null;
    this.updateMode = true;
  }

  saveContact() {

    // Check if the name is valid
  if (!this.contactName || this.contactName.trim() === '') {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Name is required. Please enter a valid name.'
    });
    return; // Stop the action if the name is invalid
  }

  // Check if the category is valid
  if (!this.selectedCategory || !this.selectedCategory.CategoryID) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Category is required. Please select a valid category.'
    });
    return; // Stop the action if the category is invalid
  }

    const contactData = {
      Name: this.contactName,
      Email: this.contactEmail,
      Phone: this.contactPhone,
      CategoryID: this.selectedCategory?.CategoryID
    };
  
    // Check if it's a new contact or an update
    if (this.updateMode == false) {
      // Create new contact
      this.contactsService.createContact(contactData, this.companyUUID).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Contact saved successfully!'
          });
          // Reset form and reload contacts
          this.initializeContact();
          this.getAllContacts();
        },
        (error: any) => {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to save contact. Please try again.'
          });
        }
      );
    } else {
      // Update existing contact
      this.contactsService.updateContact(this.contactId, contactData).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Contact updated successfully!'
          });
          // Reset form and reload contacts
          this.initializeContact();
          this.getAllContacts();
        },
        (error: any) => {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update contact. Please try again.'
          });
        }
      );
    }
  }
  

  initializeContact() {
    // Clear form fields after successful submission
    this.contactName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.selectedCategory = null;

    this.updateMode = false;
  }

  getAllContacts(){
    this.contactsService.getAllContacts(this.companyUUID).subscribe({
      next: (data: any) => {
        this.contacts = data[0];
        this.numberOfContacts = this.contacts.length;
      },
      error: (err: Error) => {
        console.error(err);
      }
    })
  }

  editContact(contact: any) {
    this.contactName = contact?.ContactName ? contact?.ContactName : null;
    this.contactEmail = contact?.ContactEmail ? contact?.ContactEmail: null;
    this.contactPhone = contact?.ContactPhone ? contact?.ContactPhone: null;
    this.selectedCategory = contact?.CategoryID ? this.categories.find((item: any) => item?.CategoryID == contact?.CategoryID) : null;
    this.contactId = contact?.ContactID ? contact?.ContactID : null;

    this.updateMode = true;
  }

}
