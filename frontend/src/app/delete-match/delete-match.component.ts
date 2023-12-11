import {Component} from "@angular/core";
import {DataService} from "../data.service";


@Component({
  selector: 'app-delete-match',
  templateUrl: './delete-match.component.html',
})

export class DeleteMatchComponent {
constructor(public dataService: DataService) {
}
}
