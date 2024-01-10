import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {

  private domain = 'http://localhost:3000'; 


  createAuthenticationHeaders() {
		// return new RequestOptions({
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		});
		let options = {
			headers: headers
		};
		return options;

	}

  constructor(private http: HttpClient) { }

  addItems(items: any[]) {
    return this.http.post(this.domain+'/addItems', items);
  }

  getItems(){
    return this.http.get(this.domain +'/getItems')
  }
}
