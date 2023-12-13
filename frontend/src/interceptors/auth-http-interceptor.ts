import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {TokenService} from "../services/token.service";
import {Observable} from "rxjs";

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private readonly service: TokenService) {}
  // The purpose of this class is to intercept http requests, check if we have the same origin for our token
  // this will add the authorization header to our token
  // to protect the token we only have a request to our own system
  // Either the url begins the origin for which the document was loaded, or we have a
  // relative url (doesn't start with *http://* or *https://*).
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.service.getToken();

    if (token && this.sameOrigin(req)) {
      return next.handle(req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`)
      }));
    }
    return next.handle(req);
  }

  private sameOrigin(req: HttpRequest<any>) {
    const isRelative = !req.url.startsWith("http://") || !req.url.startsWith("https://");
    return req.url.startsWith(location.origin) || isRelative;
  }
}
