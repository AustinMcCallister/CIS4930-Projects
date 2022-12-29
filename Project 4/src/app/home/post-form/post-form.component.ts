import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";

import { PostService } from "../../core/services/post.service";

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  postForm = new FormGroup({
    title: new FormControl(''),
    headerImage: new FormControl(''),
    content: new FormControl('')
  });

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  post() {
    const title = this.postForm.get('title');
    const content = this.postForm.get('content');
    const headerImage = this.postForm.get('headerImage');
    if (title?.value && content?.value) {
      this.postService.post(title.value, content.value, headerImage?.value).subscribe({
        next: (data): void => {
          this.postService.postArray.unshift(data);
          this.postService.postUpdate.emit(true);
        },
        error: (err): void => {
          console.log(err);
          console.log(`Error: ${err.error.message}\nStatus: ${err.error.status}`);
        }
      });
      title.setValue('');
      content.setValue('');
      headerImage?.setValue('');
    }
    else {
      alert('Title and Content fields are required')
    }
  }
}
