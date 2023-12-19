import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ToastController} from "@ionic/angular";
import {Observable, catchError} from "rxjs";

@Injectable()
export class ErrorHttpInterceptor implements HttpInterceptor {

  // The purpose of this class is so that we have an HTTP interceptor on our frontend
  // this is so that it can show an error message when appropriate

  constructor(private readonly toast: ToastController) {
  }

  // this method is used to add a message to our toast when there is an error
  private async showError(message: string) {
    return (await this.toast.create({
      message: message,
      duration: 5000,
      color: 'danger'
    })).present()
  }

  //This is the main method of the HTTP interceptor. It intercepts outgoing HTTP requests and handles errors using the catchError operator.
  // If the error is an instance of HttpErrorResponse (meaning it's an error response from the backend),
  // it calls the showError method to display a toast with the error message from the response
  // rethrow the error, so we can respond to the error in other places of the app
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(async e => {
      if (e instanceof HttpErrorResponse) {
        this.showError(e.statusText);
      }
      throw e;
    }));
  }
}
