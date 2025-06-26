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
}

export interface ApiResponse {
  status: boolean;
  message: string;
  data: any;
}

export interface Post {
  id: number;
  text: string;
  image: string | null;
  userId: number;
}