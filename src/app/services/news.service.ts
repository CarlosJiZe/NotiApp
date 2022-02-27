import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article, NewsResponse, ArticlesByCategoryAndPage } from '../interfaces';
import {map} from 'rxjs/operators'
import { IonInfiniteScroll } from '@ionic/angular'
import { storedArticlesByCategory } from '../Data/mock-news';

storedArticlesByCategory

const apiKey = environment.apiKey
const apiUrls=environment.apiUrls

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private ArticlesByCategoryAndPage: ArticlesByCategoryAndPage=storedArticlesByCategory

  constructor(private http:HttpClient) { }

  private executeQuery<T>(endpoint:string){
    console.log("Peticion hecha")
    return this.http.get<T>(`${apiUrls}${endpoint}`,{
      params:{
        apiKey:apiKey,
        country:'us'
      }
    })
  }

  getTopHeadlines():Observable<Article[]>{

    return this.getHeadlinesByCategory('business')

    //  return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=business`,{
    //    params:{
    //      apiKey:apiKey
    //    }
    //  }).pipe(
    //    map(resp=>resp.articles)
    //  )

  }

  getHeadlinesByCategory(category:string, loadMore:boolean=false):Observable<Article[]>{
    
    return of(this.ArticlesByCategoryAndPage[category].articles)
 
    if(loadMore){
      this.getArticlesByCategory(category)
    }

    if(this.ArticlesByCategoryAndPage[category]){
      return of(this.ArticlesByCategoryAndPage[category].articles)
    }

    return this.getArticlesByCategory(category)

    // return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=${category}`,{
    //   params:{
    //     apiKey:apiKey
    //   }
    // }).pipe(
    //   map(resp=>resp.articles)
    // )   
  }

  private getArticlesByCategory(category:string): Observable<Article[]>{


    if(Object.keys(this.ArticlesByCategoryAndPage).includes(category)){
      // Ya existe
      // this.ArticlesByCategoryAndPage[category].page +=0;
    }else{
      // No existe

      this.ArticlesByCategoryAndPage[category]={
        page:0,
        articles:[]
      }
    }

    const page=this.ArticlesByCategoryAndPage[category].page + 1;
  

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${ page }`).pipe(
      map(({articles})=>{

        if(articles.length===0) return this.ArticlesByCategoryAndPage[category].articles

        this.ArticlesByCategoryAndPage[category]={

          page:page,
          articles:[...this.ArticlesByCategoryAndPage[category].articles,...articles]
        }

        return this.ArticlesByCategoryAndPage[category].articles

      })
    )
  }
}
