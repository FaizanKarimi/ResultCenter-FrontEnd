import { Component, OnChanges, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tennis-head-to-head',
  templateUrl: './tennis-head-to-head.component.html',
  styleUrls: ['./tennis-head-to-head.component.css']
})
export class TennisHeadToHeadComponent implements OnChanges {

  isBothTeamsSelected: boolean;
  selectedTeamsObj: any;

  @Input() SelectedContestId: number;

  constructor() {
    this.isBothTeamsSelected = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['SelectedContestId'])
      this.SelectedContestId = changes['SelectedContestId'].currentValue;
  }

  getSelectedTeamsObj(event: any) {
    this.selectedTeamsObj = event
    this.isBothTeamsSelected = true;
  }
}