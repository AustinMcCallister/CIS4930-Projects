export default class Comment {
  commentId: number;
  comment: string;
  userId: string;
  postId: number;
  commentDate: Date;

  constructor(commentId: number, comment: string, userId: string, postId: number, commentDate: Date) {
    this.commentId = commentId;
    this.comment = comment;
    this.userId = userId;
    this.postId = postId;
    this.commentDate = commentDate;
  }
}
