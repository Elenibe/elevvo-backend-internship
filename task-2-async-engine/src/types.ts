
export interface User {
  id: number;
  name: string;
  email: string;
  city: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}


export interface DataSource<T> {
  name: string;
  url: string;
  mapItem: (raw: unknown) => T | null;
}

export interface SourceFailure {
  source: string;
  reason: string;
}

export interface EngineResult {
  users: User[];
  posts: Post[];
  todos: Todo[];
  failures: SourceFailure[];
}