export interface TopicDto {
  id: number;
  title: string;
  author: string;
  user_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MessageDto {
  id: number;
  content: string;
  author: string;
  topic_id: number;
  user_id: number;
  createdAt?: string;
}