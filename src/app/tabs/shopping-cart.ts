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

export class CartChangeEvent {
  index: number;
  cart: Cart;
}

@Directive({ selector: '[Transclude]' })
export class Transclude {

  private _Transclude: TemplateRef<any>;

  constructor(public viewRef: ViewContainerRef) { }

  @Input()
  private set Transclude(templateRef: TemplateRef<any>) {
    this._Transclude = templateRef;
    if (templateRef) {
      this.viewRef.createEmbeddedView(templateRef);
    }
  }

  private get Transclude() {
    return this._Transclude;
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

  @Input() price: string;

  @Input() date: string;

  @Input() active: boolean;

  @Input() disabled: boolean;

  @Input() class: string;

  public dateRef: TemplateRef<any>;

  public priceRef: TemplateRef<any>;

}

@Directive({ selector: '[cart-label]' })
export class CartLabel {
  constructor(public templateRef: TemplateRef<any>, cart: Cart) {
    cart.dateRef = templateRef;
    cart.priceRef = templateRef;
  }
}

@Component({
  moduleId: module.id,
  selector: 'carts',
  template: `
    <div class="carts-header-wrapper">
      <div role="button" class="prev-button" [class.disabled]="!canPageBack()" *ngIf="shouldPaginate" (click)="previousPage()">
        <em class="prev-icon">Prev</em>
      </div>
      <div role="button" class="next-button" [class.disabled]="!canPageForward()" *ngIf="shouldPaginate" (click)="nextPage()">
        <em class="next-icon">Next</em>
      </div>
      <div class="carts-canvas" [class.cart-paginated]="shouldPaginate" role="tablist" tabindex="0" (keydown.arrowRight)="focusNextTab()" (keydown.arrowLeft)="focusPreviousTab()" (keydown.enter)="selectedIndex = focusIndex" (mousewheel)="scroll($event)">
        <div class="carts-header" [style.marginLeft]="-offsetLeft + 'px'">
          <div class="cart-label" role="cart" *ngFor="let cart of carts; let i = index" [class.focus]="focusIndex === i" [class.active]="selectedIndex === i" [class.disabled]="cart.disabled" (click)="focusIndex = selectedIndex = i">
            <div class="item sa-date-price-slider__item valign-wrapper" >
              <div class="saa-dps-item">
              <span class="sa-date-price-slider__date" [Transclude]="cart.dateRef">{{cart.date}}</span>
              <span class="sa-date-price-slider__price" [Transclude]="cart.priceRef">{{cart.price}}</span >
            </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../carts/carts.css'],
  host: {
    '[class]': 'class',
    '(window:resize)': 'onWindowResize($event)'
  },
  encapsulation: ViewEncapsulation.None
})
export class Carts implements AfterContentInit {

  @ContentChildren(Cart) carts: QueryList<Cart>;

  private _isInitialized: boolean = false;
  private _focusIndex: number = 0;
  private _selectedIndex: number = 0;
  private shouldPaginate: boolean = false;
  private offsetLeft: number = 0;
  private inkBarLeft: string = '0';
  private inkBarWidth: string = '0';

  @Input() class: string;

  @Input()
  set selectedIndex(value: any) {
    if (typeof value === 'string') { value = parseInt(value); }
    if (value != this._selectedIndex) {
      this._selectedIndex = value;
      this.adjustOffset(value);
      this._updateInkBar();
      if (this.carts) {
        const carts = this.carts.toArray();
        if (!carts[value].disabled) {
          carts.forEach(cart => cart.active = false);
          carts[value].active = true;
        }
      }
      if (this._isInitialized) {
        this.change.emit(this._createChangeEvent(value));
      }
    }
  }
  get selectedIndex() { return this._selectedIndex; }

  get focusIndex(): number { return this._focusIndex; }
  set focusIndex(value: number) {
    this._focusIndex = value;
    this.adjustOffset(value);
  }

  get element() {
    const elements: any = { root: this.elementRef.nativeElement, wrapper: null, canvas: null, paging: null, carts: null };
    elements.wrapper = elements.root.querySelector('.carts-header-wrapper');
    elements.canvas = elements.wrapper.querySelector('.carts-canvas');
    elements.paging = elements.canvas.querySelector('.carts-header');
    elements.carts = elements.paging.querySelectorAll('.cart-label');
    return elements;
  }

  @Output() change: EventEmitter<CartChangeEvent> = new EventEmitter<CartChangeEvent>();

  constructor(private elementRef: ElementRef) { }

  /**
   * After Content Init
   */
  ngAfterContentInit() {
    setTimeout(() => {
      this.updatePagination();
    }, 0);
    setTimeout(() => {
      const carts = this.carts.toArray();
      if (this.selectedIndex) {
        carts.forEach(cart => cart.active = false);
        carts[this.selectedIndex].active = true;
        this.adjustOffset(this.selectedIndex);
      } else {
        let index = carts.findIndex((t: any) => t.active);
        if (index < 0) {
          carts[0].active = true;
        } else {
          this.selectedIndex = index;
        }
      }
      this._updateInkBar();
    }, 0);
    this._isInitialized = true;
  }

  /**
   * Calculates the styles from the selected cart for the ink-bar.
   */
  private _updateInkBar(): void {
    let elements = this.element;
    if (!elements.carts[this.selectedIndex]) { return; }
    let cart = elements.carts[this.selectedIndex];
    this.inkBarLeft = cart.offsetLeft + 'px';
    this.inkBarWidth = cart.offsetWidth + 'px';
  }

  /**
   * Create Change Event
   * @param index
   * @return event of CartChangeEvent
   */
  private _createChangeEvent(index: number): CartChangeEvent {
    const event = new CartChangeEvent;
    event.index = index;
    if (this.carts && this.carts.length) {
      event.cart = this.carts.toArray()[index];
    }
    return event;
  }

  /**
   * Focus next cart
   */
  focusNextTab() { this.incrementIndex(1); }

  /**
   * Focus previous cart
   */
  focusPreviousTab() { this.incrementIndex(-1); }

  /**
   * Mouse Wheel scroll
   * @param event
   */
  scroll(event: any) {
    if (!this.shouldPaginate) { return; }
    event.preventDefault();
    this.offsetLeft = this.fixOffset(this.offsetLeft - event.wheelDelta);
  }

  /**
   * Next Page
   */
  nextPage() {
    let elements = this.element;
    let viewportWidth = elements.canvas.clientWidth,
      totalWidth = viewportWidth + this.offsetLeft,
      i: number, cart: any;
    for (i = 0; i < elements.carts.length; i++) {
      cart = elements.carts[i];
      if (cart.offsetLeft + cart.offsetWidth > totalWidth) { break; }
    }
    this.offsetLeft = this.fixOffset(cart.offsetLeft);
  }

  /**
   * Previous Page
   */
  previousPage() {
    let i: number, cart: any, elements = this.element;

    for (i = 0; i < elements.carts.length; i++) {
      cart = elements.carts[i];
      if (cart.offsetLeft + cart.offsetWidth >= this.offsetLeft) { break; }
    }
    this.offsetLeft = this.fixOffset(cart.offsetLeft + cart.offsetWidth - elements.canvas.clientWidth);
  }

  /**
   * On Window Resize
   * @param event
   */
  onWindowResize(event: Event) {
    this.offsetLeft = this.fixOffset(this.offsetLeft);
    this.updatePagination();
  }

  /**
   * Can page Back
   */
  canPageBack() { return this.offsetLeft > 0; }

  /**
   * Can page Previous
   */
  canPageForward() {
    let elements = this.element;
    let lastTab = elements.carts[elements.carts.length - 1];
    return lastTab && lastTab.offsetLeft + lastTab.offsetWidth > elements.canvas.clientWidth +
      this.offsetLeft;
  }

  /**
   * Update Pagination
   */
  updatePagination() {
    let canvasWidth = this.element.root.clientWidth;
    this.element.carts.forEach((cart: any) => {
      canvasWidth -= cart.offsetWidth;
    });
    this.shouldPaginate = canvasWidth < 0;
  }

  /**
   * Increment Focus cart
   * @param inc
   */
  incrementIndex(inc: any) {
    let newIndex: number,
      index = this.focusIndex;
    for (newIndex = index + inc;
         this.carts.toArray()[newIndex] && this.carts.toArray()[newIndex].disabled;
         newIndex += inc) { }
    if (this.carts.toArray()[newIndex]) {
      this.focusIndex = newIndex;
    }
  }

  /**
   * Adjust Offset of cart
   * @param index
   */
  adjustOffset(index: number) {
    let elements = this.element;
    if (!elements.carts[index]) { return; }
    let cart = elements.carts[index],
      left = cart.offsetLeft,
      right = cart.offsetWidth + left;
    this.offsetLeft = Math.max(this.offsetLeft, this.fixOffset(right - elements.canvas.clientWidth + 32 * 2));
    this.offsetLeft = Math.min(this.offsetLeft, this.fixOffset(left));
  }

  /**
   * Fix Offset of cart
   * @param value
   * @return value
   */
  fixOffset(value: any) {
    let elements = this.element;
    if (!elements.carts.length || !this.shouldPaginate) { return 0; }
    let lastTab = elements.carts[elements.carts.length - 1],
      totalWidth = lastTab.offsetLeft + lastTab.offsetWidth;
    value = Math.max(0, value);
    value = Math.min(totalWidth - elements.canvas.clientWidth, value);
    return value;
  }

}

export const CARTS_DIRECTIVES: any[] = [CartLabel, Carts, Cart];

@NgModule({
  imports: [CommonModule],
  exports: CARTS_DIRECTIVES,
  declarations: [Transclude, CartLabel, Carts, Cart],
})
export class ShoppingCartModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ShoppingCartModule,
      providers: []
    };
  }
}
