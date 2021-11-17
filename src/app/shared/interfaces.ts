

export interface Board {
  columns: BoardColumn[]
}

export interface BoardColumn {
  id?: string;
  posts: Post[]
}

export interface Post {
  id?: string;
  title: string;
  author: string;
  text?: string;
  date?: Date;
  likes: number;
  comments?: string[] 
}




