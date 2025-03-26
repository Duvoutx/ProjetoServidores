import { Component } from '@angular/core';
import { ServidoresListComponent } from './components/servidores-list/servidores-list.component';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-root',
  imports: [ServidoresListComponent, HttpClientModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-servidores';
}
