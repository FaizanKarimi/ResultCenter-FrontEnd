import { Directive, ElementRef, HostListener } from '@angular/core';
import { CommonService } from "../../services/common.service";

@Directive({
  selector: '[toggleDropDown]'
})
export class ToggleDropDownDirective {

  show: string;
  hide: string;

  dropDownOptionsContainer: any;
  constructor(private _elementRef: ElementRef, private _commonService: CommonService) {
    this.hide = 'hide';
    this.show = 'show';
  }

  ngAfterViewInit() {
    this.dropDownOptionsContainer = this._elementRef.nativeElement.querySelector('.dropdownOptionsContainer');
    this.dropDownOptionsContainer.classList.add(this.hide);
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement): void {
    // Check if the click was outside the element
    if (targetElement && !this._elementRef.nativeElement.contains(targetElement)) {
      //this.ClickOutSide.emit(event);
      this.dropDownOptionsContainer.classList.remove(this.show);
      this.dropDownOptionsContainer.classList.add(this.hide);
    }
    else {
      //toggle the clicked dropdown
      if (this.dropDownOptionsContainer.classList.contains(this.show)) {
        this.dropDownOptionsContainer.classList.remove(this.show);
        this.dropDownOptionsContainer.classList.add(this.hide);
      }
      else {
        this.dropDownOptionsContainer.classList.remove(this.hide);
        this.dropDownOptionsContainer.classList.add(this.show);
        var selectedItem = this.dropDownOptionsContainer.querySelector('[data-isselected=true]');
        if (selectedItem)
          selectedItem.scrollIntoView(this._commonService.getScrollViewParameters());
      }
    }
  }
}