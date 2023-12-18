import { Directive, OnInit, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import {AuthService} from "../services/AuthService";
import {Role} from "../app/models";


@Directive({ selector: '[appUserRole]'})
export class UserRoleDirective implements OnInit {

  // The user role directive is a structural directive that conditionally includes a template if:
  // A user is authorized
  // A user has at least one of the allowed roles, currently only user and admin
  constructor(
    private templateRef: TemplateRef<any>,
    private authService: AuthService,
    private viewContainer: ViewContainerRef
  ) { }

  userRoles: Role[] | undefined;

  @Input()
  set appUserRole(roles: Role[]) {
    if (!roles || !roles.length) {
      throw new Error('Roles value is empty or missed');
    }

    this.userRoles = roles;
  }

  ngOnInit() {
    let hasAccess = false;

    if (this.authService.isAuthorized() && this.userRoles) {
      hasAccess = this.userRoles.some(r => this.authService.hasRole(r));
    }

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
