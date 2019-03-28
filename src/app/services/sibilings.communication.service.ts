import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable()
export class SibilingsCommunicationService {

    private messageSource = new Subject<string>();

    messageAnnounced$ = this.messageSource.asObservable();

    public pushMessage(message: string) {

        this.messageSource.next(message);

    }




    private notificationeSource = new Subject<{ topic: string, message: string }>();

    notificationAnnounced$ = this.notificationeSource.asObservable();

    public pushNotification(topic: string, message: string) {

        this.notificationeSource.next(  { topic : topic , message: message}  );

    }

}