import {AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, ViewChild} from "@angular/core";


@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class ComponentBase {
/*
  constructor(
    public cookieservice: CookieService,
    public router: Router,
    public activatedrouter: ActivatedRoute,
    public userservice: UserService
  ){
    this.baseConfig();
    this.baseInit();

  }
  environment:any = environment;



  formatfullTime(time:any) {
    if(time == null) {
      return new Date();
    }

    //1970-01-01T09:00:00.000+0000
    let hour = time.split(':')[0].split('T')[1];
    let minute = time.split(':')[1];
    let year = parseInt(time.split('-')[0]);
    let month = parseInt(time.split('-')[1]) - 1;
    let date = parseInt(time.split('-')[2].split('T')[0]);

    //console.log({ hour: hour, minute: minute });

    return Date.UTC(
      year,
      month,
      date,
      hour,
      minute,
      0,
      0
    );
  }

  formatTimeSlot(time:any) {

    if(time == null) {
      return new Date();
    }

    //1970-01-01T09:00:00.000+0000
    let hour = time.split(':')[0].split('T')[1];
    let minute = time.split(':')[1];

    console.log({ hour: hour, minute: minute });

    return Date.UTC(
      1970,
      0,
      1,
      hour,
      minute,
      0,
      0
    );
  }

  @ViewChild("LoginModal") public LoginModal: ModalDirective;


  modalaction(event:Event, path:string, userTypeId:number) {
    event.preventDefault();

    };

  }


  ngAfterContentChecked()
  {

  };

  baseInit()
  {

  };

  baseConfig()
  {
    //this.path = globalconst.getpath(this.router.url).replace(/\-/g, '/');
    //this.routeconfig = new RouterconfigModel();




  };

  ngOnInit()
  {

  };

  ngAfterViewInit()
  {

  };

  flowbackbutton()
  {

    window.history.back();

  }


  flownextbbutton()
  {
    this.router.navigateByUrl('/' + copy.path);
  }

  /*
  getpath(path:string):string {
    return globalconst.getpath(path);
  }

  isSpash(path:string):boolean {
    return globalconst.isSpash(path);
  }

  getCSS(path:string):string {
    return globalconst.getCSS(path);
  }

  usersubmit(event:Event) {
    this.cookieservice.put('user', JSON.stringify(this.model));
    this.flownextbbutton(this.router);
  }

  modalevent:any;
  modalevshowloginmodalent:any;
  showloginmodal(allowSkip:boolean, modal:any, callback:any = null) {
    this.allowSkip = allowSkip;
    modal.show();

    if(typeof callback == 'function') {
      this.modalevshowloginmodalent = callback;
    }

  }


  logout() {
    this.cookieservice.remove('currentUser');

  }

  openSession(url) {

  }


*/

}
