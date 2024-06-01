import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { CompaniesComponent } from './main/companies/companies.component';
import { ManageCompaniesComponent } from './main/companies/manage-companies/manage-companies.component';
import { SearchCompaniesComponent } from './main/companies/search-companies/search-companies.component';
import { ShowcaseComponent } from './main/showcase/showcase.component';
import { CompanyShowcaseComponent } from './main/showcase/company-showcase/company-showcase.component';
import { ConnectionDetailsComponent } from './main/showcase/connection-details/connection-details.component';
import { BusinessCardComponent } from './main/showcase/business-card/business-card.component';
import { WebsiteComponent } from './main/showcase/website/website.component';
import { PickLicenseComponent } from './main/pick-license/pick-license.component';
import { AuthGuard } from './Core/auth.guard';
import { SocialMediaAccountsComponent } from './main/showcase/social-media-accounts/social-media-accounts.component';
import { ManageEmailsListComponent } from './main/manage-emails-list/manage-emails-list.component';
import { ManageEmailsCategoriesComponent } from './main/manage-emails-list/manage-emails-categories/manage-emails-categories.component';
import { ManageEmailsComponent } from './main/manage-emails-list/manage-emails/manage-emails.component';
import { SharedCompanyProfileComponent } from './main/shared-company-profile/shared-company-profile.component';
import { UserProfileComponent } from './main/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'companies', component: CompaniesComponent,
    canActivate: [AuthGuard], // Apply the AuthGuard here
    children: [
      {
        path: '', redirectTo: 'search-campanies', pathMatch:"prefix"
      },
      {
        path: 'search-campanies', component: SearchCompaniesComponent
      },
      {
        path: 'manage-campanies', component: ManageCompaniesComponent
      },
      {
        path: 'manage-campanies/:id', component: ManageCompaniesComponent
      },
      {
    path: 'showcase', component: ShowcaseComponent,
    canActivate: [AuthGuard], // Apply the AuthGuard here
    children: [
      {
        path: 'company-showcase', component: CompanyShowcaseComponent
      },
      {
        path: 'connection-details', component: ConnectionDetailsComponent
      },
      {
        path: 'business-card', component: BusinessCardComponent
      },
      {
        path: 'website', component: WebsiteComponent
      },
      {
        path: 'social-media-accounts', component: SocialMediaAccountsComponent
      }
    ]
      },
      {
        path: 'emails-list', component: ManageEmailsListComponent,
        canActivate: [AuthGuard],
        children:[
          {
            path: 'emails-categories', component: ManageEmailsCategoriesComponent
          },
          {
            path: 'emails', component: ManageEmailsComponent
          }
        ]
      },
      {
        path: "user-profile",  component: UserProfileComponent
      }
    ]
  },
  {
    path: 'emails-list', component: ManageEmailsListComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path: 'emails-categories', component: ManageEmailsCategoriesComponent
      }
    ]
  },
  {
    path: 'pick-license', component: PickLicenseComponent,
    canActivate: [AuthGuard] // Apply the AuthGuard here if needed
  },
  { 
    path: 'cmp-profile/:uuid', component: SharedCompanyProfileComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
