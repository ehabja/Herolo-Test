import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class BookService{

    constructor(private http: HttpClient){}

    private API = 'https://www.googleapis.com/books/v1/volumes?q=';

    //retrieving data from google api
    public getBooksAsync(query): Observable<any>{
        return this.http.get(this.API + query);
    }
}