import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit {

  @Input() isLoading: boolean;
  constructor() {
  }

  ngOnInit() {
  }

}
