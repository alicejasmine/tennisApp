import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {TokenService} from "../services/token.service";
import {Observable} from "rxjs";

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private readonly service: TokenService) {}
  // The purpose of this class is to intercept http requests for auth purposes
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.service.getToken(); // fetch our token to be used for auth

    if (token && this.sameOrigin(req)) { // check if the token is the same origin
      return next.handle(req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`)
      }));
    }
    return next.handle(req); // if everything is good, make the request with an added auth header containing our token
  }

  //This method checks whether the request URL is either an absolute URL (starts with "http://" or "https://") or a relative URL.
  //return true if the URL starts with the same origin as the app or is relative.
  private sameOrigin(req: HttpRequest<any>) {
    const isRelative = !req.url.startsWith("http://") || !req.url.startsWith("https://");
    return req.url.startsWith(location.origin) || isRelative;
  }
}
