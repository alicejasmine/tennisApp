import { NgModule } from '@angular/core';
import {UserRoleDirective} from "./user-role.directive";


@NgModule({
  declarations: [UserRoleDirective],
  exports: [UserRoleDirective]
})
export class DirectiveModule { }
