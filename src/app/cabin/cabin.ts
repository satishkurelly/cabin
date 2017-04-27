import {Component, OnInit, ElementRef} from '@angular/core';

@Component({
  selector: 'cabin',
  templateUrl: 'cabin.html'
})
export class CabinComponent implements OnInit {

  _isCollapsedContent: boolean = false;
  isActive: boolean;
  _offsetLeft: number = 0;
  _shouldPaginate: boolean = false;


  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {

    this.isActive = true;
    this._isCollapsedContent = false;
  }

  flightoptions: any = [
    {
      deptairportcode: 'LHR',
      arrivalairportcode: 'DEL',
      flightno: 'AI162',
      departtime: '06:44',
      arrivaltime: '21:02',
      nonstop: 'Nonstop',
      duration: '13hr 58m',
      classes: [ { class: 'Economy', price: '428.00', currency: 'USD'},
        { class: 'Business', price: '1315.00', currency: 'USD'},
        { class: 'First', price: '4215.00', currency: 'USD'}]
    }
  ];

  upgradeOptions: any = [{ option: 'Economy Basic', price: '428.71', currency: 'USD', optionstext: 'Food & Beverages for Purchase', seatsLeft: '3 Seats Left!', foodBeverage: 'Food  & Beverages for Purchase', Wifi: '', bookingRrefund: ''},
    { option: 'Economy Plus', price: '889.71', currency: 'USD', optionstext: 'Food & Beverages for Purchase', seatsLeft: '5 Seats Left!', foodBeverage: 'Food  & Beverages for Purchase', Wifi: '', bookingRrefund: ''},
    { option: 'Economy Flex', price: 'One Sold', currency: '', optionstext: 'Food & Beverages for Purchase', seatsLeft: '4 Seats Left!', foodBeverage: 'Food  & Beverages for Purchase', Wifi: 'Available', bookingRrefund: 'Booking Changes Refundable'}];

  selectedTabIndex:number = -1;
  selectedListItem:number = -1;
  onOptionClick(index):void{
    // this._isCollapsedContent =  !_isCollapsedContent;
    this.selectedTabIndex = index;
    this.upgradeOptions  = [{ option: 'Economy Basic', price: '428.71', currency: 'USD', optionstext: 'Food & Beverages for Purchase', seatsLeft: '3 Seats Left!', foodBeverage: 'Food  & Beverages for Purchase', Wifi: '', bookingRrefund: ''},
      { option: 'Economy Plus', price: '889.71', currency: 'USD', optionstext: 'Food & Beverages for Purchase', seatsLeft: '5 Seats Left!', foodBeverage: 'Food  & Beverages for Purchase', Wifi: '', bookingRrefund: ''},
      { option: 'Economy Flex', price: 'One Sold', currency: '', optionstext: 'Food & Beverages for Purchase', seatsLeft: '4 Seats Left!', foodBeverage: 'Food  & Beverages for Purchase', Wifi: 'Available', bookingRrefund: 'Booking Changes Refundable'}];
  }


}
