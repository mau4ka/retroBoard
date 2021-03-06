export interface BoardColumn {
  _id?: string;
  name: string;
  tasks: Task[];
}

export interface NewBoardColumn {
  name: string;
}

export interface Comment {
  text: string;
  author: string;
}

export interface NewComment {
  text: string;
}

export interface Task {
  id?: string;
  _id?: string;
  text: string;
  likes?: string[];
  author?: string;
  comments?: Comment[];
}

export interface User {
  email: string;
  password: string;
  name?: string;
}

export interface getUser {
  email: string;
  name: string;
  userId: string;
}
