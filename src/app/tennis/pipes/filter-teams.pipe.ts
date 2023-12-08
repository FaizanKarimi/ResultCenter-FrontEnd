import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTeams'
})
export class FilterTeamsPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    if (searchText.indexOf('player') >= 0)
      searchText = '';
    return items.filter(it => {
      return it.Team.toLowerCase().includes(searchText);
    });
  }

}
