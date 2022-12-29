import { Component, OnInit } from '@angular/core';

import { PostService } from "../core/services/post.service";
import { UserService } from "../core/services/user.service";

import { Post } from "../core/models/post.model";
import { Token } from "../core/models/token.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  postArray: Array<Post> = new Array<Post>;
  session: Token | null;

  constructor(private userService: UserService, private postService: PostService) {
    this.session = this.userService.getSession();
  }

  ngOnInit(): void {
    this.postService.get().subscribe({
      next: (data: Post[]) => {
        this.postArray = data.map((post: Post): Post => {
          return post;
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.userService.userLoggedIn.subscribe({
      next: (): void => {
        this.session = this.userService.getSession();
      }
    });
    this.postService.postUpdate.subscribe({
      next: (): void => {
        this.postArray = this.postService.getPosts();
      }
    });
  }
}
