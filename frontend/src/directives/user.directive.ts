import { Directive, OnInit, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import {AuthService} from "../services/AuthService";


@Directive({ selector: '[appUser]'})
export class UserDirective implements OnInit {

  // this directive could be used in certain scenarios to check auth
  // could be used to add, remove, or manipulated elements in the DOM (Document Object Model)
  // different from a guard in the sense that it does not control nav
  // currently unused, since when we are checking we are typically either blocking nav (guard) or checking admin (user-role.directive)
  constructor(
    private templateRef: TemplateRef<any>,
    private authService: AuthService,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {
    const hasAccess = this.authService.isAuthorized();

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
