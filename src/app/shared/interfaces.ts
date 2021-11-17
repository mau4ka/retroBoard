export interface Board {
  columns: BoardColumn[];
}

export interface BoardColumn {
  _id?: string;
  name: string;
  tasks: Task[];
}

export interface Task {
  id?: string;
  text: string;
  likes?: number;
  comments?: string[];
}

export interface User {
  email: string;
  password: string;
}
