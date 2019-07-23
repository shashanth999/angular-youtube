import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map, switchMap, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import API_KEY from './api-key';

const API_URL = 'https://www.googleapis.com/youtube/v3/search';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular RxJs YouTube Searcher';
  searchForm: FormGroup;
  results: Observable<any>;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.search();
  }

  search() {
     this.results = this.searchForm.controls.search.valueChanges.pipe(
       debounceTime(500),
       filter(value => value.length > 3),
       distinctUntilChanged(),
       switchMap(searchTerm => this.http.get<any>(`${API_URL}?q=${searchTerm}&key=${API_KEY}&part=snippet`)),
       map(response => response.items)
     );
  }
}
