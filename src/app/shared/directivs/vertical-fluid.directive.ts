import {
    Directive, ElementRef,
    Input, HostListener, OnInit
} from "@angular/core";

declare var $;

@Directive({ selector: "[vertical-fluid]" })
export class VerticalFluidDirective implements OnInit {

    @Input() isRelativeToDocument: boolean;
    @Input() pageSpecificPadding: number;

    private footerPadding = 0;

    constructor(private el: ElementRef) {
    }

    ngOnInit(): void {
        this.resetHeight(this.el.nativeElement);
    }

    @HostListener("window:resize")
    onResize() {
        // call our matchHeight function here later
        this.resetHeight(this.el.nativeElement);
    }

    resetHeight(element) {
        let elementOffsetTop;
        let customOffset = 0;

        if ($("#integration-cloud-app-container") && $("#integration-cloud-app-container")[0] && $("#integration-cloud-app-container")[0].offsetTop) {
            customOffset = $("#integration-cloud-app-container")[0].offsetTop;
        }

        if (element && element.children[0]) {
            elementOffsetTop = element.children[0].offsetTop;
        }
        if (this.isRelativeToDocument === true) {
            elementOffsetTop = element.parentElement.offsetTop;
        }
        let calculatedHeight = window.innerHeight - elementOffsetTop - this.footerPadding - customOffset;
        if (this.pageSpecificPadding) {
            calculatedHeight = calculatedHeight - this.pageSpecificPadding;
        }

        element.style.height = calculatedHeight + "px";
    }
}
