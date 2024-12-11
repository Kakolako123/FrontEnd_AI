import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardEditComponent } from './pages/card-edit/card-edit.component';

const routes: Routes = [
  { path: 'card-edit', component: CardEditComponent },
  { path: '', redirectTo: '/card-edit', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
