import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { createCustomElement } from "@angular/elements";
import { WsdListComponent } from "./wsd-list/wsd-list.component";
import { CommonModule, APP_BASE_HREF } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MessageDialogComponent } from "./message-dialog/message-dialog.component";
import { HttpClientModule } from "@angular/common/http";
import { SideBarComponent } from "./side-bar/side-bar.component";
import { UpsertCustomWsdComponent } from "./upsert-custom-wsd/upsert-custom-wsd.component";
import { LabelComponent } from "./label/label.component";
import { WsdDetailsComponent } from "./wsd-details/wsd-details.component";
import { TabViewModule } from "primeng/tabview";
import { WsdWsdlUiComponent } from "./wsd-details/wsd-wsdl-ui/wsd-wsdl-ui.component";
import { WsdOverviewComponent } from "./wsd-details/wsd-overview/wsd-overview.component";
import { WsdOperationComponent } from "./wsd-details/wsd-operation/wsd-operation.component";
import { VerticalFluidDirective } from "./shared/directivs/vertical-fluid.directive";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {AceEditorModule} from "ng2-ace-editor";

@NgModule({
  declarations: [
      AppComponent,
      WsdListComponent,
      MessageDialogComponent,
      SideBarComponent,
      UpsertCustomWsdComponent,
      LabelComponent,
      WsdDetailsComponent,
      WsdWsdlUiComponent,
      WsdOverviewComponent,
      WsdOperationComponent,
      VerticalFluidDirective
  ],
  imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      CommonModule,
      FormsModule,
      TabViewModule,
      TooltipModule,
      DialogModule,
      AceEditorModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: "/"}
  ],
  exports: [
    MessageDialogComponent,
    LabelComponent,
    WsdWsdlUiComponent,
    WsdOverviewComponent,
    WsdOperationComponent,
    VerticalFluidDirective
  ],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    WsdListComponent,
    SideBarComponent,
    UpsertCustomWsdComponent,
    WsdDetailsComponent
  ]
})
export class AppModule {
      constructor(private injector: Injector) {
        const el0 = createCustomElement(WsdListComponent, { injector });
        customElements.define("wmic-soap-api-list-v1", el0);

        const el1 = createCustomElement(SideBarComponent, { injector });
        customElements.define("wmic-side-bar-v1", el1);

        const customwsd = createCustomElement(UpsertCustomWsdComponent, { injector });
        customElements.define("wmic-upsert-custom-wsd-v1", customwsd);

        const wsddtls = createCustomElement(WsdDetailsComponent, { injector });
        customElements.define("wmic-wsd-details-v1", wsddtls);
    }
    ngDoBootstrap() {
    }
}
