import {
  AfterContentInit,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  NgModule,
  ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';

/** Change event object that is emitted when the tab has changed. */
export class CartChange {
  constructor(public tab: Cart, public index: number) { }
}

@Directive({ selector: '[cartTransclude]' })
export class Transclude {

  private _cartTransclude: TemplateRef<any>;

  constructor(public viewRef: ViewContainerRef) { }

  @Input()
  get Transclude() { return this._cartTransclude; }
  set Transclude(templateRef: TemplateRef<any>) {
    this._cartTransclude = templateRef;
    if (templateRef) {
      this.viewRef.createEmbeddedView(templateRef);
    }
  }

}

@Component({
  moduleId: module.id,
  selector: 'cart',
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'class',
    '[class.active]': 'active'
  }
})
export class Cart {

  @Input() label: string;

  @Input() active: boolean;

  @Input() disabled: boolean;

  @Input() class: string;

  labelRef: TemplateRef<any>;

}

@Directive({ selector: '[cart-label]' })
export class CartLabel {
  constructor(public templateRef: TemplateRef<any>, tab: Cart) {
    tab.labelRef = templateRef;
  }
}

@Component({
  moduleId: module.id,
  selector: 'shopping-carts',
  templateUrl: 'carts.html',
  styleUrls: ['carts.css'],
  host: {
    '[class]': 'class',
    '(window:resize)': 'onWindowResize($event)'
  },
  encapsulation: ViewEncapsulation.None
})
export class Carts implements AfterContentInit {

  @ContentChildren(Cart) tabs: QueryList<Cart>;

  private _isInitialized: boolean = false;
  private _focusIndex: number = 0;
  private _selectedIndex: number = 0;
  _shouldPaginate: boolean = false;
  _offsetLeft: number = 0;
  _inkBarLeft: string = '0';
  _inkBarWidth: string = '0';

  @Input() class: string;

  @Input()
  get selectedIndex() { return this._selectedIndex; }
  set selectedIndex(value: any) {
    if (typeof value === 'string') { value = parseInt(value); }
    if (value !== this._selectedIndex) {
      this._selectedIndex = value;
      this.adjustOffset(value);
      this._updateInkBar();
      if (this.tabs) {
        const tabs = this.tabs.toArray();
        if (!tabs[value].disabled) {
          tabs.forEach(tab => tab.active = false);
          tabs[value].active = true;
        }
      }
      if (this._isInitialized) {
        this._emitChangeEvent();
        this.selectedIndexChange.emit(value);
      }
    }
  }

  get focusIndex(): number { return this._focusIndex; }
  set focusIndex(value: number) {
    this._focusIndex = value;
    this.adjustOffset(value);
  }

  get element() {
    const elements: any = {
      root: this.elementRef.nativeElement,
      wrapper: null,
      canvas: null,
      paging: null,
      tabs: null
    };
    elements.wrapper = elements.root.querySelector('.carts-header-wrapper');
    elements.canvas = elements.wrapper.querySelector('.carts-canvas');
    elements.paging = elements.canvas.querySelector('.carts-header');
    elements.tabs = elements.paging.querySelectorAll('.cart-label');
    return elements;
  }

  @Output() change: EventEmitter<CartChange> = new EventEmitter<CartChange>();
  @Output() selectedIndexChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private elementRef: ElementRef) { }

  /**
   * After Content Init
   */
  ngAfterContentInit() {
    setTimeout(() => {
      this.updatePagination();
    }, 0);
    setTimeout(() => {
      const tabs = this.tabs.toArray();
      if (this.selectedIndex) {
        if (this.selectedIndex >= tabs.length) {
          this.selectedIndex = 0;
        }

        this.adjustOffset(this.selectedIndex); tabs.forEach(tab => tab.active = false);
        tabs[this.selectedIndex].active = true;
      } else {
        let index = tabs.findIndex((t: any) => t.active);
        if (index < 0) {
          tabs[0].active = true;
        } else {
          this.selectedIndex = index;
        }
      }
      this._updateInkBar();
    }, 0);
    this._isInitialized = true;
  }

  /**
   * Calculates the styles from the selected tab for the ink-bar.
   */
  private _updateInkBar(): void {
    let elements = this.element;
    if (!elements.tabs[this.selectedIndex]) { return; }
    let tab = elements.tabs[this.selectedIndex];
    this._inkBarLeft = tab.offsetLeft + 'px';
    this._inkBarWidth = tab.offsetWidth + 'px';
  }

  /** Emits an event when the user selects an option. */
  _emitChangeEvent(): void {
    let index = this._selectedIndex;
    this.change.emit(new CartChange(this.tabs.toArray()[index], index));
  }

  /**
   * Focus next Tab
   */
  focusNextTab() { this.incrementIndex(1); }

  /**
   * Focus previous Tab
   */
  focusPreviousTab() { this.incrementIndex(-1); }

  /**
   * Mouse Wheel scroll
   * @param event
   */
  scroll(event: any) {
    if (!this._shouldPaginate) { return; }
    event.preventDefault();
    this._offsetLeft = this.fixOffset(this._offsetLeft - event.wheelDelta);
  }

  /**
   * Next Page
   */
  nextPage() {
    let elements = this.element;
    let viewportWidth = elements.canvas.clientWidth,
      totalWidth = viewportWidth + this._offsetLeft,
      i: number, tab: any;
    for (i = 0; i < elements.tabs.length; i++) {
      tab = elements.tabs[i];
      if (tab.offsetLeft + tab.offsetWidth > totalWidth) { break; }
    }
    this._offsetLeft = this.fixOffset(tab.offsetLeft);
  }

  /**
   * Previous Page
   */
  previousPage() {
    let i: number, tab: any, elements = this.element;

    for (i = 0; i < elements.tabs.length; i++) {
      tab = elements.tabs[i];
      if (tab.offsetLeft + tab.offsetWidth >= this._offsetLeft) { break; }
    }
    this._offsetLeft = this.fixOffset(tab.offsetLeft +
      tab.offsetWidth - elements.canvas.clientWidth);
  }

  /**
   * On Window Resize
   * @param event
   */
  onWindowResize(event: Event) {
    this._offsetLeft = this.fixOffset(this._offsetLeft);
    this.updatePagination();
  }

  /**
   * Can page Back
   */
  canPageBack() { return this._offsetLeft > 0; }

  /**
   * Can page Previous
   */
  canPageForward() {
    let elements = this.element;
    let lastTab = elements.tabs[elements.tabs.length - 1];
    return lastTab && lastTab.offsetLeft + lastTab.offsetWidth > elements.canvas.clientWidth +
      this._offsetLeft;
  }

  /**
   * Update Pagination
   */
  updatePagination() {
    let canvasWidth = this.element.root.clientWidth;
    this.element.tabs.forEach((tab: any) => {
      canvasWidth -= tab.offsetWidth;
    });
    this._shouldPaginate = canvasWidth < 0;
  }

  /**
   * Increment Focus Tab
   * @param inc
   */
  incrementIndex(inc: any) {
    let newIndex: number,
      index = this.focusIndex;
    for (newIndex = index + inc;
         this.tabs.toArray()[newIndex] && this.tabs.toArray()[newIndex].disabled;
         newIndex += inc) { }
    if (this.tabs.toArray()[newIndex]) {
      this.focusIndex = newIndex;
    }
  }

  /**
   * Adjust Offset of Tab
   * @param index
   */
  adjustOffset(index: number) {
    let elements = this.element;
    if (!elements.tabs[index]) { return; }
    let tab = elements.tabs[index],
      left = tab.offsetLeft,
      right = tab.offsetWidth + left;
    this._offsetLeft = Math.max(this._offsetLeft,
      this.fixOffset(right - elements.canvas.clientWidth + 32 * 2));
    this._offsetLeft = Math.min(this._offsetLeft, this.fixOffset(left));
  }

  /**
   * Fix Offset of Tab
   * @param value
   * @return value
   */
  fixOffset(value: any) {
    let elements = this.element;
    if (!elements.tabs.length || !this._shouldPaginate) { return 0; }
    let lastTab = elements.tabs[elements.tabs.length - 1],
      totalWidth = lastTab.offsetLeft + lastTab.offsetWidth;
    value = Math.max(0, value);
    value = Math.min(totalWidth - elements.canvas.clientWidth, value);
    return value;
  }

  traveldates: any = [
    {date: 'Wed 04 Apr', price: '$907'},
    {date: 'Wed 05 Apr', price: '$908'},
    {date: 'Wed 06 Apr', price: '$909'},
    {date: 'Wed 07 Apr', price: '$910'},
    {date: 'Wed 08 Apr', price: '$911'},
    {date: 'Wed 09 Apr', price: '$912'},
    {date: 'Wed 10 Apr', price: '$913'},
    {date: 'Wed 07 Apr', price: '$910'},
    {date: 'Wed 08 Apr', price: '$911'},
    {date: 'Wed 09 Apr', price: '$912'},
    {date: 'Wed 10 Apr', price: '$913'},
  ];


}

export const CARTS_DIRECTIVES: any[] = [CartLabel, Carts, Cart];

@NgModule({
  imports: [CommonModule],
  exports: CARTS_DIRECTIVES,
  declarations: [Transclude, CartLabel, Carts, Cart],
})
export class CartsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CartsModule,
      providers: []
    };
  }
}
