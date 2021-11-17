import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { PostsService } from '../shared/services/posts.service';
import { Post } from '../shared/interfaces';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  posts: any[] = [];
  pSub!: Subscription;

  drop(event: CdkDragDrop<any[]>, postId: string) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(event);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.postsService
        .updateBoard(event.container.id, event.container.data)
        .subscribe();
      this.postsService
        .updateBoard(event.previousContainer.id, event.previousContainer.data)
        .subscribe();
    }
  }

  submit(column: string) {
    const post: Post = {
      title: 'аеа',
      author: 'author',
      text: 'text',
      likes: 0,
    };

    this.postsService.create(post, column).subscribe(() => {
      alert(post.text);
    });
  }

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.pSub = this.postsService.getAll().subscribe((posts) => {
      this.posts = posts;
      console.log(posts);
    });
  }
}
