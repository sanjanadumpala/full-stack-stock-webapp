import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  cDate = new Date();
  cDateStr: string = '';
  news6m1dDate = new Date();
  news6m1dDateStr: string = '';
  graph2dDate = new Date();
  graph2dDateStr: string = '';
  graph2y1dDate = new Date();
  graph2y1dDateStr: string = '';

  constructor(private http: HttpClient) {
    this.getDates(); 
  }

  getDates() {
    this.news6m1dDate.setMonth(this.news6m1dDate.getMonth() - 6);
    this.news6m1dDate.setDate(this.news6m1dDate.getDate() - 1);
    this.graph2dDate.setDate(this.graph2dDate.getDate() - 2);
    this.graph2y1dDate.setMonth(this.graph2y1dDate.getMonth() - 24);
    this.graph2y1dDate.setDate(this.graph2y1dDate.getDate() - 1);
    this.cDateStr = this.changeStyle(this.cDate);
    this.news6m1dDateStr = this.changeStyle(this.news6m1dDate);
    this.graph2dDateStr = this.changeStyle(this.graph2dDate);
    this.graph2y1dDateStr = this.changeStyle(this.graph2y1dDate);
  }

  changeStyle(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  autocompleteData(substr: string): Observable<any[]> {
    const url = `http://localhost:3000/autocomplete?ticker=${substr}`;
    return this.http.get<any>(url).pipe(
      map(response => 
        response.result.filter((item: any) => !item.displaySymbol.includes('.'))
      )
    );
  }

  fetchCompanyData(query: string): Observable<any[]> {
    const url = `http://localhost:3000/description?ticker=${query}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  fetchStockData(query: string): Observable<any[]> {
    const url = `http://localhost:3000/lateststockprice?ticker=${query}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  fetchPeerData(query: string): Observable<any[]> {
    const url = `http://localhost:3000/peers?ticker=${query}`;
    return this.http.get<any[]>(url).pipe(
      map(peers => peers.filter(ticker => !ticker.includes('.'))),
      map(peers => peers.filter(ticker => !ticker.includes(query)))
    );
  }

  fetchGraphData(query: string): Observable<any[]> {
    const url = `http://localhost:3000/history?ticker=${query}&currentdate=${this.cDateStr}&pastdate=${this.graph2y1dDateStr}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  fetchGraphData2(query: string): Observable<any[]> {
    const url = `http://localhost:3000/historytime?ticker=${query}&currentdate=${this.cDateStr}&pastdate=${this.graph2dDateStr}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  fetchNewsData(query: string): Observable<any[]> {
    const url = `http://localhost:3000/companynews?ticker=${query}&currentdate=${this.cDateStr}&pastdate=${this.news6m1dDateStr}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response]),
      map(newsSnippets => newsSnippets.filter(item => item.image && item.headline && item.url && item.datetime && item.summary && item.source)),
      map(newsSnippets => newsSnippets.slice(0, 20))
    );
  }

  fetchTrendsData(query: string): Observable<any[]> {
    const url = `http://localhost:3000/trends?ticker=${query}&currentdate=${this.cDateStr}&pastdate=${this.graph2y1dDateStr}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  fetchSentimentData(query: string): Observable<any[]> {
    const url = `http://localhost:3000/sentiment?ticker=${query}&currentdate=${this.cDateStr}&pastdate=${this.graph2y1dDateStr}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  fetchEarningData(query: string): Observable<any[]> {
    const url = `http://localhost:3000/earnings?ticker=${query}&currentdate=${this.cDateStr}&pastdate=${this.graph2y1dDateStr}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  addToWatchlist(query: string): Observable<any[]> {
    const url = `http://localhost:3000/addwatchlist?ticker=${query}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  removeFromWatchlist(query: string): Observable<any[]> {
    const url = `http://localhost:3000/deletewatchlist?ticker=${query}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  getWatchlist(): Observable<any[]> {
    const url = `http://localhost:3000/getwatchlist`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  checkWatchlist(query: string): Observable<any[]> {
    const url = `http://localhost:3000/checkwatchlist?ticker=${query}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  addToPortfolio(query: string, stocks: string, totalcost: string): Observable<any[]> {
    const url = `http://localhost:3000/addportfolio?ticker=${query}&stocks=${stocks}&totalcost=${totalcost}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  updatePortfolio(query: string, stocks: string, totalcost: string): Observable<any[]> {
    const url = `http://localhost:3000/updateportfolio?ticker=${query}&stocks=${stocks}&totalcost=${totalcost}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  removeFromPortfolio(query: string): Observable<any[]> {
    const url = `http://localhost:3000/deleteportfolio?ticker=${query}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  getPortfolio(): Observable<any[]> {
    const url = `http://localhost:3000/getportfolio`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  checkPortfolio(query: string): Observable<any[]> {
    const url = `http://localhost:3000/checkportfolio?ticker=${query}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  getWallet(): Observable<any[]> {
    const url = `http://localhost:3000/getwallet`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }

  setWallet(total: string): Observable<any[]> {
    const url = `http://localhost:3000/setwallet?total=${total}`;
    return this.http.get<any[]>(url).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }
}
