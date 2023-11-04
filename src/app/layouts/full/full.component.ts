import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent {

  search: boolean = false;
  sidebarVisible2: boolean = false;
    
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver , private apiService : ApiService) { }

  ngOnInit(){
    this.getProfileData();
  }

  routerActive: string = "activelink"; 

  sidebarMenu: sidebarMenu[] = [
    {
      link: "/home",
      icon: "home",
      menu: "Dashboard",
    },
    {
      link: "/item-list",
      icon: "disc",
      menu: "Stock",
    },
    {
      link: "/bill-listing",
      icon: "disc",
      menu: "Bill List",
    },
    {
      link: "/purchase-listing",
      icon: "disc",
      menu: "Purchase List",
    },
    // {
    //   link: "/forms",
    //   icon: "layout",
    //   menu: "Forms",
    // },
    // {
    //   link: "/alerts",
    //   icon: "info",
    //   menu: "Alerts",
    // },
    // {
    //   link: "/grid-list",
    //   icon: "file-text",
    //   menu: "Grid List",
    // },
    // {
    //   link: "/menu",
    //   icon: "menu",
    //   menu: "Menus",
    // },
    // {
    //   link: "/table",
    //   icon: "grid",
    //   menu: "Tables",
    // },
    // {
    //   link: "/expansion",
    //   icon: "divide-circle",
    //   menu: "Expansion Panel",
    // },
    // {
    //   link: "/chips",
    //   icon: "award",
    //   menu: "Chips",
    // },
    // {
    //   link: "/tabs",
    //   icon: "list",
    //   menu: "Tabs",
    // },
    // {
    //   link: "/progress",
    //   icon: "bar-chart-2",
    //   menu: "Progress Bar",
    // },
    // {
    //   link: "/toolbar",
    //   icon: "voicemail",
    //   menu: "Toolbar",
    // },
    // {
    //   link: "/progress-snipper",
    //   icon: "loader",
    //   menu: "Progress Snipper",
    // },
    // {
    //   link: "/tooltip",
    //   icon: "bell",
    //   menu: "Tooltip",
    // },
    // {
    //   link: "/snackbar",
    //   icon: "slack",
    //   menu: "Snackbar",
    // },
    // {
    //   link: "/slider",
    //   icon: "sliders",
    //   menu: "Slider",
    // },
    {
      link: "/login",
      icon: "layers",
      menu: "Logout",
    },
  ]

  profile_data : any;
  user_id : any = {};
  getProfileData(){
    this.user_id = localStorage.getItem('billing_token')
    console.log(JSON.parse(this.user_id));
    this.apiService.getUserProfile(JSON.parse(this.user_id)['userId']).then((res:any)=>{
      console.log(res);
      this.profile_data = res['data'];
    }).catch((err)=>{
      this.profile_data = {};
    })
  }

}
