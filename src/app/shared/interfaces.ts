export interface Board {
  columns: BoardColumn[];
}

export interface BoardColumn {
  _id?: string;
  name: string;
  tasks: Task[];
}

export interface NewBoardColumn {
  name: string;
}

export interface Task {
  id?: string;
  text: string;
  likes?: number;
  author?: string;
  comments?: string[];
}

export interface User {
  email: string;
  password: string;
}
