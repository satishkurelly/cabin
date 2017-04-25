import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  _isCollapsedContent: boolean = false;
  isActive: boolean;


  private hide(event) {
    this.isActive = !this.isActive;
  }


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

  upgradeOptions: any;
  upgradeOptions2: any;

  selectedTabIndex:number = -1;
  selectedListItem:number = -1;
  onItemClick(index):void{
    this.selectedTabIndex = index;
    this.selectedListItem = -1;
    this.upgradeOptions = [];
    this.upgradeOptions  = [{ option: 'Economy Basic', price: '428.71', currency: 'USD', optionstext: 'Food & Beverages for Purchase', seatsLeft: '3 Seats Left!', foodBeverage: 'Food  & Beverages for Purchase', Wifi: '', bookingRrefund: ''},
      { option: 'Economy Plus', price: '889.71', currency: 'USD', optionstext: 'Food & Beverages for Purchase', seatsLeft: '5 Seats Left!', foodBeverage: 'Food  & Beverages for Purchase', Wifi: '', bookingRrefund: ''},
      { option: 'Economy Flex', price: 'One Sold', currency: '', optionstext: 'Food & Beverages for Purchase', seatsLeft: '4 Seats Left!', foodBeverage: 'Food  & Beverages for Purchase', Wifi: 'Available', bookingRrefund: 'Booking Changes Refundable'}];


  }

  getBgColor(i){
    return i == this.selectedTabIndex ? 'yellow' :'#c8cfd6';
  }

  getFlag(index):boolean{
    return this.selectedTabIndex == index;
  }

  toggleSelection(i):boolean{
    let flag:boolean = true;
    if(this.selectedTabIndex != -1 ) flag = true;
    if(this.selectedListItem == i) flag = false;
    return flag;
  }

}
