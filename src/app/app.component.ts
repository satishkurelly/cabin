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

  tabs: Array<any> = [
    { title: 'Dynamic Title 1', content: 'Dynamic content 1' },
    { title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true },
    { title: 'Dynamic Title 3', content: 'Dynamic content 3' }
  ];

  handleChange(tab: Event) {
    console.log('Tab Changed');
  };
  traveldates: any = [
    {date: 'Wed 04 Apr', price: '$907'},
    {date: 'Wed 05 Apr', price: '$908'},
    {date: 'Wed 06 Apr', price: '$909'},
    {date: 'Wed 07 Apr', price: '$910'},
    {date: 'Wed 08 Apr', price: '$911'},
    {date: 'Wed 09 Apr', price: '$912'},
    {date: 'Wed 10 Apr', price: '$913'},
    {date: 'Wed 08 Apr', price: '$911'},
    {date: 'Wed 09 Apr', price: '$912'},
    {date: 'Wed 10 Apr', price: '$913'},
    ];



  private change(tab: Event) {
    console.log('Tab Changed');
};
}
