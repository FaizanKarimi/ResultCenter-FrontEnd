import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.css']
})
export class ContentListComponent implements OnInit {
  languageKeys: any;
  @Input() isDateSelected: boolean;
  @Input() inputSelectedTab: string;
  @Output() onTabSelect = new EventEmitter<any>();
  activeClass: string;
  constructor(private _languageService: LanguageService) { }

  ngOnInit() {
    // this.activeClass = 'Results';
    this.languageKeys = JSON.parse(this._languageService.getLocalStorageItem('Languagekeys'));
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.isDateSelected) {
      this.selectedTab('Results');
    }
    else if (changes['inputSelectedTab'] != undefined && changes['inputSelectedTab'].currentValue != undefined) {
      this.selectedTab(this.inputSelectedTab);
    }
  }

  selectedTab(tab: string) {
    this.activeClass = tab;
    this.onTabSelect.emit(tab);
  }

}