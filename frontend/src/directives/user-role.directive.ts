import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Role } from '../app/models';
import {AuthService} from "../services/AuthService";

@Directive({ selector: '[appUserRole]' })
export class UserRoleDirective implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  @Input() appUserRole: Role[] = [];

  // The user role directive is a structural directive that conditionally includes a template if:
  // A user is authorized
  // A user has at least one of the allowed roles, currently only user and admin
  // While the guard controls nav, this will just manipulate elements.
  // Such as hiding buttons in MatchesComponent if the user is not an Admin.
  constructor(
    private templateRef: TemplateRef<any>,
    private authService: AuthService,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {
    this.subscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      let hasAccess = false;

      if (isLoggedIn && this.appUserRole) {
        hasAccess = this.appUserRole.some(role => this.authService.hasRole(role));
      }

      if (hasAccess) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
