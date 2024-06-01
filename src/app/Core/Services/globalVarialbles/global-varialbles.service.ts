import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarialblesService {

  public companyUUID = new BehaviorSubject<any>(null);
  public companyIMAGE = new BehaviorSubject<any>(null);
  public companyName = new BehaviorSubject<any>(null);
  public subscriptionDetails = new BehaviorSubject<any>(null);

  constructor() { }
}
