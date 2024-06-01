import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Constants } from '../../../Core/constants';
import Swal from 'sweetalert2';
import { CompanyService } from '../../../Core/Services/company/company.service';
import { ProjectService } from '../../../Core/Services/project/project.service';
import { ServiceService } from '../../../Core/Services/services/servics.service';
import { AchievementService } from '../../../Core/Services/achievement/achievement.service';
import { GlobalVarialblesService } from '../../../Core/Services/globalVarialbles/global-varialbles.service';
import { LocalstorageService } from '../../../Core/Services/LocalStorage/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-showcase',
  templateUrl: './company-showcase.component.html',
  styleUrls: ['./company-showcase.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompanyShowcaseComponent implements OnInit {
  logo: any = Constants.LOGO_PLACE_HOLDER;
  selectedFile: File | undefined;
  companyId: any = null; // Example companyId
  companyUUID: any = null;

  color: any;
  services: any[] = [];
  projects: any[] = [];
  updateMode: boolean = false;

  // Service fields
  serviceName: string = '';
  serviceDescription: string = '';
  serviceColor: string = '#000000'; // Default color
  serviceId: any;

  // Project fields
  projectName: string = '';
  projectDescription: string = '';
  showVideo: boolean = false;
  imageLink: any = null;
  videoLink: any = null;
  projectId: any;

  // Achievements
  achievements: any[] = [];
  achievementName: string = '';
  achievementId: any;

  maxNumberOfCompanies: any = 0;
  maxNumberOfServices: any = 0;
  numberOfServices: any = 0;
  maxNumberOfProjects: any = 0;
  numberOfProjects: any = 0;
  maxNumberOfMilestones: any = 0;
  numberOfMilestones: any = 0;

  constructor(private companyService: CompanyService,
              private serviceService: ServiceService,
              private projectService: ProjectService,
              private achievementService: AchievementService,
              private router: Router,
              private globalVarialblesService: GlobalVarialblesService) {}

  ngOnInit(): void {
    this.globalVarialblesService.subscriptionDetails.subscribe({
      next: (data: any) => {
        console.log("Subscription details received:", data);
    
        const accountsFeature = data?.find((item: any) => item.FeatureName === "Accounts");
        this.maxNumberOfCompanies = accountsFeature ? accountsFeature.LimitValue : null;
        console.log("maxNumberOfCompanies ==> ", this.maxNumberOfCompanies);
    
        const servicesFeature = data?.find((item: any) => item.FeatureName === "Services");
        this.maxNumberOfServices = servicesFeature ? (servicesFeature.LimitValue / this.maxNumberOfCompanies) : 0;
        console.log("maxNumberOfServices ==> ", this.maxNumberOfServices);
    
        const projectsFeature = data?.find((item: any) => item.FeatureName === "Projects");
        this.maxNumberOfProjects = projectsFeature ? (projectsFeature.LimitValue / this.maxNumberOfCompanies) : 0;
        console.log("maxNumberOfProjects ==> ", this.maxNumberOfProjects);
    
        const milestonesFeature = data?.find((item: any) => item.FeatureName === "Milestones");
        this.maxNumberOfMilestones = milestonesFeature ? (milestonesFeature.LimitValue / this.maxNumberOfCompanies) : 0;
        console.log("maxNumberOfMilestones ==> ", this.maxNumberOfMilestones);
      },
      error: (err: Error) => {
        console.error("Error fetching subscription details", err);
      }
    });

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
      this.globalVarialblesService.companyIMAGE.subscribe(value => {
        this.logo = this.companyService.getCompanyImage(value);
      })
    }
    this.getAllServices();
    this.getAllProjects();
    this.getAllAcheivements();
  }

  // Handle logo upload
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.logo = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile as Blob);
  }

  // Upload company logo
  uploadLogo() {
    if (!this.selectedFile) {
      Swal.fire('Error', 'No file selected', 'error');
      return;
    }

    this.companyService.uploadCompanyLogo(this.companyUUID, this.selectedFile).subscribe(
      (data: any) => {
        Swal.fire('Success', 'Logo uploaded successfully', 'success');
        this.globalVarialblesService.companyIMAGE.next(data?.company?.LogoURL);
        // console.log("data ==> ", data);
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to upload logo', 'error');
        console.error('Error uploading logo:', error);
      }
    );
  }

  // Save or update service
  saveService() {
    const serviceData = {
      title: this.serviceName,
      description: this.serviceDescription,
      borderColor: this.serviceColor
    };

    if (this.updateMode) {
      this.serviceService.updateService(this.companyUUID, this.serviceId, serviceData).subscribe({
        next: () => {
          Swal.fire('Success', 'Service saved successfully!', 'success');
          this.resetServiceFields();
          this.getAllServices();
        },
        error: () => {
          Swal.fire('Error', 'Failed to save service', 'error');
        }
      });
    } else {
      this.serviceService.createService(this.companyUUID, serviceData).subscribe({
        next: () => {
          Swal.fire('Success', 'Service saved successfully!', 'success');
          this.resetServiceFields();
          this.getAllServices();
        },
        error: () => {
          Swal.fire('Error', 'Failed to save service', 'error');
        }
      });
    }
  }

  resetServiceFields() {
    this.serviceName = '';
    this.serviceDescription = '';
    this.serviceColor = '#000000';
    this.updateMode = false;
    this.serviceId = undefined;
  }

  // Delete service
  deleteService(service: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this service!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceService.deleteService(this.companyUUID, service?.ServiceID).subscribe(
          () => {
            Swal.fire('Deleted!', 'Your service has been deleted.', 'success');
            this.getAllServices();
          },
          () => {
            Swal.fire('Error!', 'Failed to delete service.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your service is safe :)', 'error');
      }
    });
  }

  // Save project
  saveProject1() {
    const projectData = {
      Name: this.projectName,
      Description: this.projectDescription,
      VideoURL: this.videoLink,
      ImageURL: this.imageLink
    };

    this.projectService.createProject(this.companyUUID, projectData).subscribe({
      next: () => {
        Swal.fire('Success', 'Project saved successfully!', 'success');
        this.resetProjectFields();
        this.getAllProjects();
      },
      error: () => {
        Swal.fire('Error', 'Failed to save project', 'error');
      }
    });
  }

  resetProjectFields() {
    this.projectName = '';
    this.projectDescription = '';
    this.showVideo = false;
    this.imageLink = '';
    this.videoLink = '';
  }

  // Fetch all services
  getAllServices() {
    this.serviceService.getAllServices(this.companyUUID).subscribe({
      next: (data: any[]) => {
        this.services = data;
        this.numberOfServices = this.services.length;
      },
      error: (err: Error) => {
        console.error('Error fetching services:', err);
      }
    });
  }

  // edit Service
  editService(service: any){
    this.serviceColor = service?.BorderColor;
    this.serviceDescription = service?.Description;
    this.serviceName = service?.Title;
    this.serviceId = service?.ServiceID;

    this.updateMode = true;

  }

  // Fetch all projects
  getAllProjects() {
    this.projectService.getAllProjectsByCompany(this.companyUUID).subscribe({
      next: (data: any[]) => {
        this.projects = data;
        this.numberOfProjects = this.projects.length;
      },
      error: (err: Error) => {
        console.error('Error fetching projects:', err);
      }
    });
  }

  //edit project
  editProject(project: any) {
    // Populate form fields with project data
    this.projectName = project.Name;
    this.projectDescription = project.Description;
    this.showVideo = project.VideoURL !== '';
    this.imageLink = project.ImageURL;
    this.videoLink = project.VideoURL;
  
    // Optionally, you can set a flag to indicate edit mode
    this.updateMode = true;
  
    // Optionally, store the project ID for updating
    this.projectId = project.ProjectID;
  }

  saveProject() {
    // Create an object with project data
    const projectData = {
      Name: this.projectName,
      Description: this.projectDescription,
      VideoURL: this.showVideo ? this.videoLink : '',
      ImageURL: this.imageLink
    };
  
    // Check if it's in update mode
    if (this.updateMode) {
      // If update mode, call updateProject method
      this.updateProject(projectData);
    } else {
      // If not in update mode, call createProject method
      this.createProject(projectData);
    }
  }
  
  createProject(projectData: any) {
    this.projectService.createProject(this.companyUUID, projectData).subscribe(
      (response: any) => {
        console.log('Project created successfully:', response);
        // Optionally, reset form fields or navigate to another page
        this.resetFields();
        this.getAllProjects(); // Refresh project list
      },
      error => {
        console.error('Error creating project:', error);
        // Handle error, show error message to user
        Swal.fire('Error', 'Failed to create project', 'error');
      }
    );
  }
  
  updateProject(projectData: any) {
    // Check if projectId is available (assumed to be set in editProject function)
    if (!this.projectId) {
      console.error('Project ID not available for update');
      return;
    }
    // Call updateProject method
    this.projectService.updateProject(this.companyUUID, this.projectId, projectData).subscribe(
      (response: any) => {
        console.log('Project updated successfully:', response);
        // Optionally, reset form fields or navigate to another page
        this.resetFields();
        this.getAllProjects(); // Refresh project list
      },
      error => {
        console.error('Error updating project:', error);
        // Handle error, show error message to user
        Swal.fire('Error', 'Failed to update project', 'error');
      }
    );
  }
  
  resetFields() {
    // Reset form fields
    this.projectName = '';
    this.projectDescription = '';
    this.showVideo = true;
    this.imageLink = null,
    this.videoLink = null;
    this.updateMode = false;
  }

  deleteProject(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this project!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed deletion, call your delete service method
        this.projectService.deleteProject(this.companyUUID, item?.ProjectID).subscribe(
          () => {
            // Show success message
            Swal.fire(
              'Deleted!',
              'Your project has been deleted.',
              'success'
            );
            this.getAllProjects(); // Refresh project list
          },
          (error) => {
            // Show error message if deletion failed
            Swal.fire(
              'Error!',
              'Failed to delete project.',
              'error'
            );
            console.error('Error deleting project:', error);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User cancelled deletion, show message
        Swal.fire(
          'Cancelled',
          'Your project is safe :)',
          'error'
        );
      }
    });
  }
  
// Function to save the achievement
saveAchievement() {
  // Perform validation if needed
  if (!this.isValidInput()) {
    // Show error message or return
    Swal.fire('Error', 'Please enter a valid achievement name', 'error');
    return;
  }

  const achievementData: any = {
    Title: this.achievementName
  };

  if (this.updateMode == false) {
    // Creating a new achievement
    this.achievementService.createAchievement(this.companyUUID, achievementData).subscribe(
      (response: any) => {
        // Handle success response
        Swal.fire('Success', 'Achievement created successfully!', 'success');
        // Optionally, reset input fields or perform any other action
        this.getAllAcheivements();
      },
      (error: any) => {
        // Handle error response
        Swal.fire('Error', 'Failed to create achievement', 'error');
        console.error('Error creating achievement:', error);
      }
    );
  } else {
    // Updating an existing achievement
    this.achievementService.updateAchievement(this.companyUUID, this.achievementId, achievementData).subscribe(
      (response: any) => {
        // Handle success response
        Swal.fire('Success', 'Achievement updated successfully!', 'success');
        // Optionally, reset input fields or perform any other action
        this.getAllAcheivements();
        this.updateMode = false;
      },
      (error: any) => {
        // Handle error response
        Swal.fire('Error', 'Failed to update achievement', 'error');
        console.error('Error updating achievement:', error);
      }
    );
  }

  // Reset editedAchievementId and achievementName after saving
  this.achievementId = null;
  this.achievementName = '';

}


  // Function to validate input fields
  isValidInput(): boolean {
    if (!this.achievementName.trim()) {
      // Show error message for empty achievement name
      return false;
    }
    return true;
  }

  // Get All acheivements
  getAllAcheivements(){
    this.achievementService.getAllAchievements(this.companyUUID).subscribe({
      next: (data: any) => {
        this.achievements = data[0];
        this.numberOfMilestones = this.achievements.length;
      },
      error: (err: Error) => {
        console.error(err);
      }
    })
  }

  // Function to set the achievement name to be edited
  editAchievement(achievement: any) {
    this.achievementId = achievement?.AchievementID;
    this.achievementName = achievement?.Title;
    this.updateMode = true;
  }

  // Function to delete an achievement
deleteAchievement(item: any) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this achievement!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed deletion, call your delete service method
      this.achievementService.deleteAchievement(this.companyUUID, item?.AchievementID).subscribe(
        (response) => {
          // Show success message
          Swal.fire('Deleted!', 'Your achievement has been deleted.', 'success');
          // Optionally, you can perform any additional actions after deletion
          this.getAllAcheivements();
        },
        (error) => {
          // Show error message if deletion failed
          Swal.fire('Error!', 'Failed to delete achievement.', 'error');
          console.error('Error deleting achievement:', error);
        }
      );
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // User cancelled deletion, show message
      Swal.fire('Cancelled', 'Your achievement is safe :)', 'error');
    }
  });
}


}
