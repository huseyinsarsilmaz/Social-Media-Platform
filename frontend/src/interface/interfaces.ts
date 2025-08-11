export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  last: boolean;
  totalElements: number;
}

export interface UserSimple {
  id: number;
  email: string;
  username: string;
  name: string;
  surname: string;
  createdAt: string;
  bio: string;
  profilePicture: string | null;
  coverPicture: string | null;
  following: boolean;
}

export interface Post {
  id: number;
  text: string;
  image: string | null;
  userId: number;
  createdAt: string;
  liked: boolean;
  likeCount: number;
}

export interface PostWithUser {
  user: UserSimple;
  post: Post;
}

export interface Feed {
  Content: PostWithUser[];
  page: number;
  last: boolean;
}
export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  iss: string;
}
