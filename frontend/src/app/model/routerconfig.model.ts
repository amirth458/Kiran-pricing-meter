export class RouterconfigModel {
  constructor(
    public showHeader: boolean = true,
    public showFooter: boolean = true,
    public path: string = ''
  ){
    this.showFooter = showFooter;
    this.showHeader = showHeader;
    this.path = path;
  }
}
