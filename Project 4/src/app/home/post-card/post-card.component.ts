import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";

import { Post } from "../../core/models/post.model";

import { PostService } from "../../core/services/post.service";
import { UserService } from "../../core/services/user.service";

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
  @Input() index: number | undefined;
  @Input() post: Post | undefined;

  editForm = new FormGroup({
    title: new FormControl(''),
    headerImage: new FormControl(''),
    content: new FormControl(''),
  });
  sessionUser: string = '';
  editing: boolean;

  constructor( private postService: PostService, private userService: UserService) {
    this.sessionUser = this.userService.getUser();
    this.editing = false;
  }

  ngOnInit(): void {
    this.userService.userLoggedIn.subscribe({
      next: (): void => {
        this.sessionUser = this.userService.getUser();
      }
    });
    this.editForm.get('title')!.setValue(this.post!.title);
    this.editForm.get('headerImage')!.setValue(this.post!.headerImage);
    this.editForm.get('content')!.setValue(this.post!.content);
  }

  editToggle() {
    this.editing = !this.editing;
  }

  submitEdit() {
    const title = this.editForm.get('title')!.value;
    const headerImage = this.editForm.get('headerImage')!.value;
    const content = this.editForm.get('content')!.value;
    if (title && content) {
      this.postService.patch(title, content, headerImage, this.post!.postId).subscribe({
        next: (data): void => {
          console.log(data);
          this.post = data;
          this.postService.postUpdate.emit(true);
          this.editing = false;
        },
        error: (err): void => {
          console.log(err);
          console.log(`Error: ${err.error.message}\nStatus: ${err.error.status}`);
        }
      });
    }
    else {

    }
  }

  delete() {
    this.postService.delete(this.post!.postId).subscribe({
      next: (): void => {
        this.postService.postArray.splice(this.index!, 1);
        this.postService.postUpdate.emit(true);
      },
      error: (err): void => {
        console.log(err);
        console.log(`Error: ${err.error.message}\nStatus: ${err.error.status}`);
      }
    });
  }
}
