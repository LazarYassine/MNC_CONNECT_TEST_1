import { Component, OnInit } from '@angular/core';
import { EmailCategoryService } from '../../../Core/Services/emailCategory/email-category.service';
import { AuthService } from '../../../Core/Services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-emails-categories',
  templateUrl: './manage-emails-categories.component.html',
  styleUrls: ['./manage-emails-categories.component.scss']
})
export class ManageEmailsCategoriesComponent implements OnInit {
  searchCategoryName: string | null = null;
  
  categoryName: string | null = null;
  selectedColor: string = "#000000";
  categoryId: any = null;

  isAddDialogVisible: boolean = false;
  dialogHeaderTitle: string = "Add Category";
  categories: any[] = [];

  updateMode: boolean = false;

  constructor(private emailCategoryService: EmailCategoryService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  showAddDialog() {
    this.isAddDialogVisible = true;
  }

  getAllCategories(){
    this.emailCategoryService.getAllCategories(<any>this.authService.getUserIdFromToken()).subscribe({
      next: (data: any) => {
        console.log("list of caategories ==> ", data[0]);
        this.categories = data[0];
      },
      error: (err: Error) => {
        console.log(err);
      }
    })
  }

  searchCategories() {
    if (this.searchCategoryName?.trim()) {
      this.emailCategoryService.searchCategoriesByName(this.searchCategoryName?.trim(), <any>this.authService.getUserIdFromToken())
        .subscribe((categories: any[]) => {
          console.log(categories);
          this.categories = categories;
        }, error => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to search categories. Please try again later.'
          });
        });
    } else {
      // console.log('Please enter a search term');
      Swal.fire({
        icon: 'info',
        title: 'Info',
        text: 'Please enter a search term.'
      });
      this.getAllCategories();
    }
  }

  addCategory() {
    const categoryData = {
      categoryName: this.categoryName,
      borderColor: this.selectedColor,
    };

    this.emailCategoryService.createCategory(categoryData, <any>this.authService.getUserIdFromToken())
      .subscribe(response => {
        // console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Category added successfully.'
        });
        this.isAddDialogVisible = false;
        this.getAllCategories();
        this.initialize();
      }, error => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add category. Please try again later.'
        });
      });
  }

  goEdit(item: any){
    this.categoryName = item?.category_name ? item?.category_name : null;
    this.selectedColor = item?.border_color ? item?.border_color : "#000000";
    this.categoryId = item?.id ? item?.id : null;
    this.isAddDialogVisible = true;
    this.updateMode = true;
    this.dialogHeaderTitle = "Edit Category";
  }

  initialize(){
    this.categoryName = '';
    this.selectedColor = "#000000";
    this.updateMode = false;
    this.dialogHeaderTitle = "Add Category";
    this.categoryId = null;
    this.searchCategoryName = '';
  }


  saveCategory() {

    if (!this.categoryName) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Category name is required!',
      });
      return;
    }
    

    const categoryData = {
        categoryName: this.categoryName,
        borderColor: this.selectedColor,
    };

    if (this.updateMode) {
        // Update existing category
        this.updateCategory(categoryData);
    } else {
        // Create new category
        this.createCategory(categoryData);
    }
}

private createCategory(categoryData: any) {
    this.emailCategoryService.createCategory(categoryData, <any>this.authService.getUserIdFromToken())
        .subscribe(response => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Category added successfully.'
            });
            this.isAddDialogVisible = false;
            this.getAllCategories();
            this.initialize();
        }, error => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add category. Please try again later.'
            });
        });
}

private updateCategory(categoryData: any) {
    if (this.updateMode) {
        // Show confirmation dialog for update
        Swal.fire({
            title: 'Update Category?',
            text: 'Are you sure you want to update this category?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.emailCategoryService.updateCategory(this.categoryId, categoryData, <any>this.authService.getUserIdFromToken())
                    .subscribe(response => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Category updated successfully.'
                        });
                        this.isAddDialogVisible = false;
                        this.getAllCategories();
                        this.initialize();
                    }, error => {
                        console.error(error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to update category. Please try again later.'
                        });
                    });
            }
        });
    }
}

deleteCategory(categoryId: number) {
  Swal.fire({
      title: 'Delete Category',
      text: 'Are you sure you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it'
  }).then((result) => {
      if (result.isConfirmed) {
          this.emailCategoryService.deleteCategory(categoryId, <any>this.authService.getUserIdFromToken())
              .subscribe(response => {
                  Swal.fire({
                      icon: 'success',
                      title: 'Success',
                      text: 'Category deleted successfully.'
                  });
                  this.getAllCategories();
              }, error => {
                  console.error(error);
                  Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'Failed to delete category. Please try again later.'
                  });
              });
      }
  });
}


}
