import { Routes } from '@angular/router';
import { ServidoresListComponent } from './components/servidores-list/servidores-list.component';

export const routes: Routes = [
  { path: 'servidores', component: ServidoresListComponent },
  { path: '', redirectTo: '/servidores', pathMatch: 'full' },
];
