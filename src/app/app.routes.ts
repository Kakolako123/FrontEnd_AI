// @ts-ignore

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { SideBarComponent } from "./pages/side-bar/side-bar.component";
import { CardEditComponent } from './pages/card-edit/card-edit.component';
import { SalesforceTestComponent } from './components/salesforce-test/salesforce-test.component';
import { ApiDocumentationComponent } from './components/api-documentation/api-documentation.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', component: AccueilComponent },
  { path: 'side-bar', component: SideBarComponent },
  { path: 'card-edit', component: CardEditComponent },
  { path: 'salesforce-test', component: SalesforceTestComponent },
  { path: 'api-documentation', component: ApiDocumentationComponent }
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);
