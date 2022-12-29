import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { Post } from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  @Output() postUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() postEmitter: EventEmitter<Post[]> = new EventEmitter<Post[]>();

  postArray: Array<Post> = new Array<Post>;

  constructor(private httpClient: HttpClient) {
    this.get().subscribe({
      next: (data: Post[]): void => {
        this.postArray = data.map((post: Post): Post => {
          return post;
        });
        this.postUpdate.emit(true);
        this.postEmitter.emit(this.postArray);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getPosts(): Array<Post> {
    return this.postArray;
  }

  get() {
    return this.httpClient.get<Post[]>(`${environment.serverEndpoint}/Posts/`);
  }

  post(title: string, content: string, headerImage: string | null | undefined) {
    if (!headerImage) {
      headerImage = ' ';
    }
    const token = localStorage.getItem('token');
    const header: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(token ? token : '').token}`);
    return this.httpClient.post<Post>(`${environment.serverEndpoint}/Posts/`, { title: title, content: content, headerImage: headerImage }, { headers: header });
  }

  patch(title: string, content: string, headerImage: string | null | undefined, postId: number) {
    if (!headerImage) {
      headerImage = ' ';
    }
    const token = localStorage.getItem('token');
    const header: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(token ? token : '').token}`);
    return this.httpClient.patch<Post>(`${environment.serverEndpoint}/Posts/${postId}`, { title: title, content: content, headerImage: headerImage }, { headers: header });
  }

  delete(postId: number) {
    const token = localStorage.getItem('token');
    const header: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(token ? token : '').token}`);
    return this.httpClient.delete(`${environment.serverEndpoint}/Posts/${postId}`, { headers: header });
  }
}
