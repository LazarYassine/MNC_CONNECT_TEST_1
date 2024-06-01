import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ServiceService } from '../../Core/Services/services/servics.service';
import { ProjectService } from '../../Core/Services/project/project.service';
import { AchievementService } from '../../Core/Services/achievement/achievement.service';
import { SocialMediaService } from '../../Core/Services/SocialMedia/social-media.service';
import { BusinessCardService } from '../../Core/Services/BusinessCard/business-card.service';
import { CompanyService } from '../../Core/Services/company/company.service';

@Component({
  selector: 'app-shared-company-profile',
  templateUrl: './shared-company-profile.component.html',
  styleUrl: './shared-company-profile.component.scss',
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
export class SharedCompanyProfileComponent implements OnInit {
  uuid: any;
  items: MenuItem[] | undefined;
  services: any = [];
  projects: any = [];
  achievements: any = [];
  accounts: any = [];
  cards: any = [];

  businessLogo: any = null;

  is_uuid_exist: boolean = false;

  @ViewChild('homeSection') homeSection: ElementRef | undefined;
  @ViewChild('servicesSection') servicesSection: ElementRef | undefined;
  @ViewChild('projectsSection') projectsSection: ElementRef | undefined;
  @ViewChild('contactSection') contactSection: ElementRef | undefined;
  @ViewChild('achievementsSection') achievementsSection: ElementRef | undefined;
  @ViewChild('businessCardSection') businessCardSection: ElementRef | undefined;

  constructor(private route: ActivatedRoute,
              private servicesService: ServiceService,
              private projectsService: ProjectService,
              private achievementsService: AchievementService,
              private socialMediaAccountsService: SocialMediaService,
              private businessCardService: BusinessCardService,
              private companyService: CompanyService
  ) {}

  ngOnInit() {
    // Retrieve the UUID from the route parameters
    this.uuid = this.route.snapshot.paramMap.get('uuid');
    console.log('UUID:', this.uuid);
    this.checkCompanyExistsByUUID();

    this.items = [
      {
        label: 'Home',
        identifier: 'home',
        icon: 'pi pi-home',
        command: () => this.scrollToSection("home")
      },
      {
        label: 'Services',
        identifier: 'services',
        icon: 'pi pi-info-circle',
        command: () => this.scrollToSection("services")
      },
      {
        label: 'Projects',
        identifier: 'projects',
        icon: 'pi pi-briefcase',
        command: () => this.scrollToSection("projects")
      },
      {
        label: 'Achievements',
        identifier: 'achievements',
        icon: 'pi pi-trophy',
        command: () => this.scrollToSection("achievements")
      },
      {
        label: 'Contact',
        identifier: 'contact',
        icon: 'pi pi-envelope',
        command: () => this.scrollToSection("contact")
      },
      {
        label: 'Business Card',
        identifier: 'businessCard',
        icon: 'pi pi-id-card',
        command: () => this.scrollToSection("businessCard")
      }
    ];
    
    this.getBusinessLogo();

    this.getAllServices();
  
    this.getAllProjects();
  
    this.getAllAchievements();
    
    this.getAllSocialMediaAccounts();
  
    this.getAllCards();
  
}

toggleCard(card: any) {
  card.isFrontVisible = !card.isFrontVisible;
}

scrollToSection(sectionIdentifier: string) {
  switch(sectionIdentifier) {
    case 'home':
      this.homeSection?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      break;
    case 'services':
      this.servicesSection?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      break;
    case 'projects':
      this.projectsSection?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      break;
    case 'contact':
      this.contactSection?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      break;
    case 'achievements':
      this.achievementsSection?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      break;
    case 'businessCard':
      this.businessCardSection?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      break;
    default:
      break;
  }
}

getAllServices(){
 this.servicesService.getAllServices(this.uuid).subscribe({
  next: (data: any) => {
    this.services = data;
  },
  error: (err: Error) => {
    console.error(err);
  }
 }) 
}

getAllProjects(){
  this.projectsService.getAllProjectsByCompany(this.uuid).subscribe({
   next: (data: any) => {
     this.projects = data;
   },
   error: (err: Error) => {
     console.error(err);
   }
  }) 
 }

 getAllAchievements(){
  this.achievementsService.getAllAchievements(this.uuid).subscribe({
   next: (data: any) => {
     this.achievements = data[0];
   },
   error: (err: Error) => {
     console.error(err);
   }
  }) 
 }

 getAllSocialMediaAccounts(){
  this.socialMediaAccountsService.getAllSocialMediaAccounts(this.uuid).subscribe({
   next: (data: any) => {
     this.accounts = data;
   },
   error: (err: Error) => {
     console.error(err);
   }
  }) 
 }

 getAllCards() {
  this.businessCardService.getAllBusinessCards(this.uuid).subscribe({
    next: (data: any[]) => {
      console.log(data);
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
    },
    error: (error) => {
      console.error('Error fetching business cards:', error);
    }
  });
}

checkCompanyExistsByUUID(){
    this.companyService.checkCompanyExistsByUUID(this.uuid).subscribe({
      next: (res: any) => {
        console.log("res ==> ", res);
        this.is_uuid_exist = res?.exists;
      },
      error:(err: Error) => {
        console.log(err);
      }
    })
}

getBusinessLogo(){
  this.companyService.getCompanyByUUID(this.uuid).subscribe({
    next: (data: any) => {
      // console.log(data);
      this.businessLogo = this.companyService.getCompanyImage(data[0]?.LogoURL);
    },
    error: (err: Error) => {
      console.error(err);
    }
  })
}

}