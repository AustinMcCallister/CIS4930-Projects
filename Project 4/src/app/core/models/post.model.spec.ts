import { Post } from './post.model';

describe('Post', () => {
  it('should create an instance', () => {
    expect(new Post(0, new Date(), '', '', '', '', new Date())).toBeTruthy();
  });
});
