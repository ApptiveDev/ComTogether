// 커뮤니티 관련 타입 정의

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    nickname: string;
    avatar?: string;
    role: string;
  };
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  views_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityComment {
  id: number;
  post_id: number;
  content: string;
  author: {
    id: number;
    nickname: string;
    avatar?: string;
  };
  parent_id?: number;
  replies?: CommunityComment[];
  likes_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

export interface CreateCommentRequest {
  content: string;
  parent_id?: number;
}

export interface PostFilter {
  category?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'views';
  page?: number;
  limit?: number;
}
