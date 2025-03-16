import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {GButtonComponent} from '../about/g-button/g-button.component';
import {GAutocompleteComponent} from '../about/g-autocomplete/g-autocomplete.component'


@Component({
  selector: 'app-about',
  imports: [GButtonComponent, GAutocompleteComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
