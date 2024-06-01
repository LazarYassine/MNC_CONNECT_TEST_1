import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './main/home/home.component';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthRoutingModule } from './auth/auth.routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CompaniesComponent } from './main/companies/companies.component';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { ManageCompaniesComponent } from './main/companies/manage-companies/manage-companies.component';
import { SearchCompaniesComponent } from './main/companies/search-companies/search-companies.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ShowcaseComponent } from './main/showcase/showcase.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { SidebarModule } from 'primeng/sidebar';
import { CompanyShowcaseComponent } from './main/showcase/company-showcase/company-showcase.component';
import { FieldsetModule } from 'primeng/fieldset';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CardModule } from 'primeng/card';
import { ConnectionDetailsComponent } from './main/showcase/connection-details/connection-details.component';
import { TabViewModule } from 'primeng/tabview';
import { BusinessCardComponent } from './main/showcase/business-card/business-card.component';
import { WebsiteComponent } from './main/showcase/website/website.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PickLicenseComponent } from './main/pick-license/pick-license.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarComponent } from './main/toolbar/toolbar.component';
import { SocialMediaAccountsComponent } from './main/showcase/social-media-accounts/social-media-accounts.component';
import { ManageEmailsListComponent } from './main/manage-emails-list/manage-emails-list.component';
import { ManageEmailsCategoriesComponent } from './main/manage-emails-list/manage-emails-categories/manage-emails-categories.component';
import { AddEditCategoriesComponent } from './main/manage-emails-list/manage-emails-categories/add-edit-categories/add-edit-categories.component';
import { SearchCategoriesComponent } from './main/manage-emails-list/manage-emails-categories/search-categories/search-categories.component';
import { ManageEmailsComponent } from './main/manage-emails-list/manage-emails/manage-emails.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { TokenInterceptor } from './Core/Interceptors/TokenInterceptor';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SharedCompanyProfileComponent } from './main/shared-company-profile/shared-company-profile.component';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { QRCodeModule } from 'angularx-qrcode';
import { UserProfileComponent } from './main/user-profile/user-profile.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CompaniesComponent,
    ManageCompaniesComponent,
    SearchCompaniesComponent,
    ShowcaseComponent,
    CompanyShowcaseComponent,
    ConnectionDetailsComponent,
    BusinessCardComponent,
    WebsiteComponent,
    PickLicenseComponent,
    ToolbarComponent,
    SocialMediaAccountsComponent,
    ManageEmailsListComponent,
    ManageEmailsCategoriesComponent,
    AddEditCategoriesComponent,
    SearchCategoriesComponent,
    ManageEmailsComponent,
    SharedCompanyProfileComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    AuthRoutingModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    ToolbarModule,
    AvatarModule,
    TooltipModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule,
    SpeedDialModule,
    SidebarModule,
    FieldsetModule,
    ColorPickerModule,
    CardModule,
    TabViewModule,
    HttpClientModule,
    InputSwitchModule,
    DialogModule,
    MenubarModule,
    CheckboxModule,
    FileUploadModule,
    PaginatorModule,
    OverlayPanelModule,
    TieredMenuModule,
    QRCodeModule,
    NgxPaginationModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
