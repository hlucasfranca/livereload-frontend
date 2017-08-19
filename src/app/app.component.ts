import {Component, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class StatusService {

  private statusUrl = 'http://localhost:8080/status/';

  constructor(private http: Http) {

  }

  public getStatus(): Observable<any> {
    return this.http.get(this.statusUrl)
      .map(res => res.json());
  }

}

class Maquina {
  posicao: number;
  status: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private timerSubscription: any;
  private commentsSubscription: Subscription;
  status: Maquina[];

  constructor(private statusService: StatusService) {
    this.refreshData();
  }

  private refreshData(): void {
    this.commentsSubscription = this.statusService.getStatus().subscribe( (status: Maquina[]) => {
      this.status = status;
      this.subscribeToData();
    });
  }

  private subscribeToData(): void {
    this.timerSubscription = Observable.timer(1000).first().subscribe(() => this.refreshData());
  }
}
