import { Component, OnInit } from '@angular/core';
// declare var $:JQueryStatic;

@Component({
  selector: 'app-pricing-meter-demo',
  templateUrl: './pricing-meter-demo.component.html',
  styleUrls: ['./pricing-meter-demo.component.scss']
})
export class PricingMeterDemoComponent implements OnInit {

  constructor() {
    // let item = { progress:after{
    //   transform: rotate(90
    //   deg);
    // }
  }


  ngOnInit(): void {
    // $(function () {
    //   var range = $("#range")[0];
    //   var percent = ((range.value - range.min) / (range.max - range.min)) * 5;
    //   var percentshow = Math.round(
    //     ((range.value - range.min) / (range.max - range.min)) * 100
    //   );
    //   if (percent < 5) {
    //     $(".progress .circle").attr("style", "animation-delay:-" + percent + "s");
    //     $("body").append(
    //       "<div id='meterstyle'><style>.progress:after{animation-delay:-" +
    //       percent +
    //       "s;}</style></div>"
    //     );
    //   } else {
    //     $(".progress .circle").attr("style", "animation-delay:5s");
    //     $("body").append(
    //       "<div id='meterstyle'><style>.progress:after{animation-delay:5s;}</style></div>"
    //     );
    //   }
    //   $(".progress .precent").text(percentshow + " km/h");
    //   $(document).on("input", "#range", function () {
    //     var percent = ((this.value - this.min) / (this.max - this.min)) * 5;
    //     var percentshow = Math.round(
    //       ((this.value - this.min) / (this.max - this.min)) * 100
    //     );
    //     $("#meterstyle").remove();
    //     if (percent < 5) {
    //       $(".progress .circle").attr("style", "animation-delay:-" + percent + "s");
    //       $("body").append(
    //         "<div id='meterstyle'><style>.progress:after{animation-delay:-" +
    //         percent +
    //         "s;}</style></div>"
    //       );
    //     } else {
    //       $(".progress .circle").attr("style", "animation-delay:5s");
    //       $("body").append(
    //         "<div id='meterstyle'><style>.progress:after{animation-delay:5s;}</style></div>"
    //       );
    //     }
    //     $(".progress .precent").text(percentshow + " km/h");
    //   });
    // });
  }



}
