import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class SibilingsCommunicationService {

    private messageSource = new Subject<string>();

    messageAnnounced$ = this.messageSource.asObservable();

    private notificationeSource = new Subject<{ topic: string, message: any }>();

    notificationAnnounced$ = this.notificationeSource.asObservable();

    public pushMessage(message: string) {

        this.messageSource.next(message);

    }

    public pushNotification(topic: string, message: any) {

        this.notificationeSource.next({topic: topic, message: message});

    }

}
