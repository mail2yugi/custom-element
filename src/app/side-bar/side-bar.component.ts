import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";

interface NavItem {
  displayText: string;
  isEnabled: boolean;
  icon: string;
  routerLink: string;
}

@Component({
 // selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.scss"]
})
export class SideBarComponent implements OnInit, OnChanges {
  sideNavItems: any;

  @Input() set navItems(navItems) {
    this.sideNavItems = JSON.parse(navItems);
  }

  @Output() notify: EventEmitter<NavItem> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.navItems && changes.navItems.currentValue) {
        this.sideNavItems = JSON.parse(changes.navItems.currentValue);
        console.log("in Side Bar Comp::::" + JSON.stringify(this.sideNavItems));
    }
  }

  navItemClicked(navItem: NavItem) {
    this.notify.emit(navItem);
  }
}
