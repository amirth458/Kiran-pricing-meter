
export class globalconst {

  public static getpath(path:string):string {
    let temp = [];
    if(path.split("/").length > 1) {
      //path = path.split("/")[1];

      //console.log(path)
      for(let i = 0; i < path.split("/").length;i++) {

        if(i > 0) {
          temp.push(path.split("/")[i]);
        }
      }

    }
    return temp.join('-').replace(/\//g, '');
  }

  public static isSpash(path:string):boolean {
    let _path = this.getpath(path);

    return !(_path == "" || _path == "home");
  }

  public static getCSS(path:string):string {
    let _path = this.getpath(path);
    let css = 'path-' + _path;

    if(this.hiddenHeaders.indexOf(_path) > -1) {
      css += ' visible-xs hidden';
    }

    return css;
  }

  public static undefined = 'undefined';
  public static function = 'function';
  public static user = 'user';

  public static hiddenHeaders = ["", "home", "provider"]

}
