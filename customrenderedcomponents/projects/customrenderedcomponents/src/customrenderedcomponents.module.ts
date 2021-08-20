
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ServoyPublicModule, SpecTypesService } from '@servoy/public';
import { CustomRenderedComponentsCustomList } from './customlist/customlist.component';
import { CustomRenderedComponentsFoundsetList } from './foundsetlist/foundsetlist.component';
import {SortableOptions} from './sortableoptions';
import Sortable, { MultiDrag, Swap} from 'sortablejs';

@NgModule({
    declarations: [
        CustomRenderedComponentsCustomList,
        CustomRenderedComponentsFoundsetList
    ],
    providers: [],
    imports: [
      ServoyPublicModule,
      CommonModule
    ],
    exports: [
        CustomRenderedComponentsCustomList,
        CustomRenderedComponentsFoundsetList
      ]
})
export class CustomRenderedComponentsModule {
      constructor( specTypesService: SpecTypesService ) {
         specTypesService.registerType('customrenderedcomponents-foundsetlist.sortableOptions', SortableOptions);
         specTypesService.registerType('customrenderedcomponents-customlist.sortableOptions', SortableOptions);
         Sortable.mount(new MultiDrag());
         Sortable.mount(new Swap());
      }
}
