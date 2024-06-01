import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EmailsListService } from '../../../Core/Services/emailsList/emails-list.service';
import { EmailCategoryService } from '../../../Core/Services/emailCategory/email-category.service';
import { AuthService } from '../../../Core/Services/auth/auth.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { PaginationInstance } from 'ngx-pagination';
import { GlobalVarialblesService } from '../../../Core/Services/globalVarialbles/global-varialbles.service';


@Component({
  selector: 'app-manage-emails',
  templateUrl: './manage-emails.component.html',
  styleUrl: './manage-emails.component.scss',
  providers: [MessageService]
})
export class ManageEmailsComponent implements OnInit {

  downloading = false; // Flag to track downloading state

  isImportant: boolean = false;

  isDialogVisible: boolean = false; 
  emails: any[] = [];
  categories: any[] = [];
  selectedSearchCategory: any = null;
  isSearchImportant: boolean = false;

  criteria: any = {
    categoryId: this.selectedSearchCategory?.id,            // Category ID to filter by
    status: this.isSearchImportant !== true ? null : 1,            // Status to filter by (true or false)
    searchTerm: null,    // Search term to filter by (optional)
    page: 1,                  // Page number for pagination
    pageSize: 10              // Number of items per page
  };

  first: number = 0;

  rows: number = 10;
  total: number = 0;
  maxSize: number = 7;
  directionLinks: boolean = true;
  autoHide: boolean = false;
  responsive: boolean = false;
  config: any = {
      id: 'advanced',
      itemsPerPage: 10,
      currentPage: 1
  };
  currentPage: any = 1;
  labels: any = {
    previousLabel: 'Previous',
    nextLabel: 'Next',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };

  //--- variables for add and edit email addresses
  emailAddress: string = '';
  selectedCategory: any = null;
  isImportantEmail: boolean = false;
  emailId: any = null;
  isEditMode: boolean = false;

  //--- varibles for upload emails
  isUploadDialogVisible: boolean = false;
  selectedUploadCategory: any = null;
  isImportantUploadEmail: boolean = false;
  uploadedEmails: string[] = [];
  file_name: any = "Upload file";

  maxNumberOfCompanies: any = 0;
  maxNumberOfEmails: any = 0;
  numberOfEmails: any = 0;

  constructor(private emailService: EmailsListService,
              private categoriesService: EmailCategoryService,
              private authService: AuthService,
              private messageService: MessageService,
              private globalVarialblesService: GlobalVarialblesService){}

  ngOnInit(): void {
    this.globalVarialblesService.subscriptionDetails.subscribe({
      next: (data: any) => {
        console.log("Subscription details received:", data);
    
        const accountsFeature = data?.find((item: any) => item.FeatureName === "Accounts");
        this.maxNumberOfCompanies = accountsFeature ? accountsFeature.LimitValue : null;
        console.log("maxNumberOfCompanies ==> ", this.maxNumberOfCompanies);
    
        const emailsFeature = data?.find((item: any) => item.FeatureName === "Email Management");
        this.maxNumberOfEmails = emailsFeature ? (emailsFeature.LimitValue / this.maxNumberOfCompanies) : 0;
        console.log("maxNumberOfEmails ==> ", this.maxNumberOfEmails);
      },
      error: (err: Error) => {
        console.error("Error fetching subscription details", err);
      }
    });
    this.getAllCategories();
    this.getAllEmails();
  }

  showDialog(){
    this.isDialogVisible = true;
  }

  hideDialog(){
    this.isDialogVisible = false;
  }

  showUploadDiloag(){
    this.isUploadDialogVisible = true;
  }

  hideUploadDiloag(){
    this.isUploadDialogVisible = false;
  }

  getAllEmails(){
    
    this.emailService.searchEmailsByCriteria(this.criteria, this.authService.getUserIdFromToken()).subscribe({
      next: (data: any) => {
        this.emails = data.emails[0];
        console.log("list of email ==> ", data);
        this.first = data?.currentPage - 1;
        this.rows = data?.pageSize;
        this.total = data?.total;
        this.numberOfEmails = data?.total;
      },
      error: (err: Error) => {
        console.log(err);
      }
    })
    
  }

  getAllCategories(){
    
    this.categoriesService.getAllCategories(<any>this.authService.getUserIdFromToken()).subscribe({
      next: (data: any) => {
        this.categories = data[0];
        console.log("list of categories ==> ", data[0]);
      },
      error: (err: Error) => {
        console.log(err);
      }
    })
    
  }

  goEdit(email: any){
    this.emailId = email?.email_id ? email?.email_id : null;
    this.selectedCategory = email?.category_id ? this.categories.find((item: any) => item?.id === email?.category_id) : null;
    this.emailAddress = email?.email_address ? email?.email_address : null;
    this.isImportantEmail = email?.is_important !== undefined && email?.is_important !== null ? !!email.is_important : false;
    this.isEditMode = true;
    this.showDialog();
  }

  deleteEmail(id: any){
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this email?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.emailService.deleteEmailFromList(id)
          .subscribe(() => {
            Swal.fire(
              'Deleted!',
              'Email has been deleted.',
              'success'
            );
            this.getAllEmails();
            // Perform any additional actions after deletion
          }, (error: any) => {
            console.error(error);
            Swal.fire(
              'Error!',
              'Failed to delete email. Please try again later.',
              'error'
            );
          });
      }
    });
  }
  

  save() {
    if (!this.selectedCategory?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a category!',
      });
      return;
    } else if (!this.emailAddress) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Email address is required!',
      });
      return;
    }
    if (this.isEditMode) {
      this.updateEmail();
    } else {
      this.createEmail();
    }
  }
  
  createEmail() {
    const emailData = {
      emailAddress: this.emailAddress,
      category_id: this.selectedCategory?.id,
      is_important: this.isImportantEmail
    };
    console.log(emailData);
  
    this.emailService.addEmailToList(emailData)
      .subscribe(response => {
        // Handle success response
        console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Email added successfully.'
        });
        this.initialize();
        this.getAllEmails(); // Refresh the email list if needed
      }, error => {
        // Handle error
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add email. Please try again later.'
        });
      });
  }
  
  updateEmail() {
    const emailData = {
      emailAddress: this.emailAddress,
      category_id: this.selectedCategory?.id,
      is_important: this.isImportantEmail
    };
  
    this.emailService.editEmailInList(this.emailId, emailData)
      .subscribe(response => {
        // Handle success response
        console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Email updated successfully.'
        });
        this.initialize();
        this.getAllEmails(); // Refresh the email list if needed
      }, error => {
        // Handle error
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update email. Please try again later.'
        });
      });
  }
  


  initialize() {
    this.criteria = {
      categoryId: null,            // Category ID to filter by
      status: null,            // Status to filter by (true or false)
      searchTerm: null,    // Search term to filter by (optional)
      page: 1,                  // Page number for pagination
      pageSize: 10              // Number of items per page
    };
    this.emailAddress = ''; // Reset email address field
    this.selectedCategory = null; // Reset selected category
    this.isImportantEmail = false; // Reset importance status
    this.emailId = null; // Reset email ID (if applicable)
    this.isEditMode = false; // Reset edit mode flag
    this.uploadedEmails = [];
  }
  

  filterEmails(){
    if( this.selectedSearchCategory ) {
      this.criteria.categoryId = this.selectedSearchCategory?.id;
    }
    else {
      this.criteria.categoryId = null;
    }
    
    this.criteria.status = this.isSearchImportant === true ? 1 : null;

    console.log("criteria ==> ", this.criteria);
    this.emailService.searchEmailsByCriteria(this.criteria, this.authService.getUserIdFromToken()).subscribe({
      next: (data: any) => {
        this.emails = data.emails[0];
        console.log("list of email ==> ", data);
        this.currentPage = data?.currentPage;
        this.first = data?.currentPage;
        this.rows = data?.pageSize;
        this.total = data?.total;
        console.log("first ==> ", this.first);
        console.log("rows ==> ", this.rows);
        console.log("total ==> ", this.total);
      },
      error: (err: Error) => {
        console.log(err);
      }
    })
    
  }


  exportCanvas(): void {
    const url = '/assets/Canvas_Files/canva_emails.xlsx';
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'canva_emails.xlsx';
    anchor.click();
  }

  onTemplatedUpload(files: any[]): void {
    this.uploadedEmails = []; // Clear the array on upload
    if (!files || files.length === 0) {
      this.showError('No file selected');
      return;
    }
    const file = files[0];
    if (file.size > 1000000) {
      this.showError('File size exceeds the limit (1MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as ArrayBuffer;
      let workbook;
      // Check if it's an Excel file
      if (file.name.endsWith('.xlsx')) {
        const wb = XLSX.read(new Uint8Array(data), { type: 'array' });
        workbook = wb.Sheets[wb.SheetNames[0]];
      }
      // Check if it's a CSV file
      else if (file.name.endsWith('.csv')) {
        const wb = XLSX.read(new Uint8Array(data), { type: 'array' });
        workbook = wb.Sheets[wb.SheetNames[0]];
      } else {
        this.showError('Unsupported file format. Please upload a CSV or Excel file.');
        return;
      }
      const emails: any[] = [];
      const headers: any[] = [];
      for (const key in workbook) {
        if (key[0] === '!') continue;
        const col: any = key.substring(0, 1);
        const row: any = parseInt(key.substring(1));
        const value: any = workbook[key].v;
        if (row === 1) {
          headers[col] = value.toLowerCase().trim();
        } else {
          if (headers[col] === 'email') {
            emails.push(value.trim());
          }
        }
      }
      if (emails.length === 0) {
        this.showError('Email column not found');
        this.uploadedEmails = []; // Clear the array if there's an issue
        return;
      }
      this.uploadedEmails = emails;
      this.showSuccess('Emails extracted successfully');
      console.log(this.uploadedEmails);
    };
    if (file) {
      reader.readAsArrayBuffer(file);
    }
  }


  onSelectedFiles(event: any): void {
    // Clear previous selection if any
    this.uploadedEmails = [];
  }

  showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }


  // Example method to insert multiple emails
  insertEmails() {

    console.log("list of uploaded emails ==> ", this.uploadedEmails);
    console.log("category ==> ", this.selectedUploadCategory?.id);
    console.log("isImportant ==> ", this.isImportantUploadEmail);

    // Check if selectedUploadCategory exists
    if (!this.selectedUploadCategory || !this.selectedUploadCategory.id) {
      Swal.fire({
          title: 'Category Not Selected',
          text: 'Please choose a category',
          icon: 'error'
      });
      return; // Exit the function early if category is not selected
  }

  // Check if uploadedEmails exist and is an array
  if (!this.uploadedEmails || !Array.isArray(this.uploadedEmails) || this.uploadedEmails.length === 0) {
      Swal.fire({
          title: 'No Emails Uploaded',
          text: 'Please upload at least one email',
          icon: 'error'
      });
      return; // Exit the function early if no emails are uploaded
  }
  this.isUploadDialogVisible = false;
  this.emailService.insertMultipleEmails(this.uploadedEmails, this.selectedUploadCategory?.id, this.isImportantUploadEmail)
  .subscribe(
    response => {
      // Success message
      Swal.fire({
        title: 'Success',
        text: 'Emails inserted successfully',
        icon: 'success'
      });

      console.log('Emails inserted successfully:', response);
      // Handle success
      // this.hideUploadDiloag();
      this.initialize();
      this.getAllEmails();
    },
    error => {
      // Error message
      Swal.fire({
        title: 'Error',
        text: 'Failed to insert emails',
        icon: 'error'
      });

      console.error('Failed to insert emails:', error);
      // Handle error
    }
);
  }

  onPageChange(event: any) {
    console.log(event)
    
    // this.first = event?.first;
    // this.rows = event?.rows;
    // this.currentPage = event.page;
    this.criteria.page = event;
    this.criteria.pageSize = this.rows;
    // this.config.currentPage = event?.page + 1;
    this.filterEmails();
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (!files || files.length === 0) {
      this.showError('No file selected');
      return;
    }

    const file = files[0];
    if (file.size > 1000000) {
      this.showError('File size exceeds the limit (1MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      let workbook;
      if (file.name.endsWith('.xlsx')) {
        workbook = XLSX.read(data, { type: 'array' });
      } else if (file.name.endsWith('.csv')) {
        workbook = XLSX.read(data, { type: 'array' });
      } else {
        this.showError('Unsupported file format. Please upload a CSV or Excel file.');
        return;
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const emails: string[] = [];
      const headers: string[] = jsonData[0].map((header: string) => header.toLowerCase().trim());

      const emailIndex = headers.indexOf('email');
      if (emailIndex === -1) {
        this.showError('Email column not found');
        this.uploadedEmails = [];
        return;
      }

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const email = row[emailIndex]?.trim();
        if (email) {
          emails.push(email);
        }
      }

      if (emails.length === 0) {
        this.showError('No emails found');
      } else {
        this.uploadedEmails = emails;
        
        console.log("This is the number of uploaded emails ==> "+ this.uploadedEmails.length);
        console.log(this.maxNumberOfEmails + " and " + this.numberOfEmails + " and " + this.uploadedEmails.length);
        if (this.numberOfEmails + this.uploadedEmails.length > this.maxNumberOfEmails) {
          this.showError("User has exceeded the maximum number of allowed emails.");
          // Handle the case where the user exceeds the allowed number of emails
          // For example, you could show an error message to the user
      } else {
          // console.log("User has not exceeded the maximum number of allowed emails.");
          // Handle the case where the user is within the allowed number of emails
          // For example, proceed with the upload
      }
        this.showSuccess('Emails extracted successfully');
        console.log(this.uploadedEmails);
        this.file_name = file?.name;
      }
    };

    reader.readAsArrayBuffer(file);
  }

  exportEmailList() {
    this.downloading = true;
    if( this.selectedSearchCategory ) {
      this.criteria.categoryId = this.selectedSearchCategory?.id;
    }
    else {
      this.criteria.categoryId = null;
    }
    
    this.criteria.status = this.isSearchImportant === true ? 1 : null;

    this.emailService.exportEmailList(this.criteria, this.authService.getUserIdFromToken()).subscribe(
      (data: Blob) => {
        this.downloading = false;
        this.downloadFile(data);
      },
      error => {
        this.downloading = false;
        console.error('Error exporting email list:', error);
        // Handle error
      }
    );
  }

  private downloadFile(data: Blob) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // Specify MIME type for Excel file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email_list.xlsx'; // Specify filename
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

}


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
