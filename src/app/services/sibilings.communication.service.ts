import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable()
export class SibilingsCommunicationService {

    private messageSource = new Subject<string>();

    messageAnnounced$ = this.messageSource.asObservable();

   public pushMessage(message: string) {

    this.messageSource.next(message);

}

}