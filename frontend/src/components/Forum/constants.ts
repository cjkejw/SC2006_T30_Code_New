// src/constants.ts

// Reusable types
export interface CommentProps {
    username: string;
    content: string;
  }
  
  export interface PostProps {
    title: string;
    content: string;
    username: string;
    time: string;
    comments: CommentProps[];
    reported?: boolean;
    reportReason?: string;
  }
  
  // Initial empty new post object
  export const initialNewPost: Omit<PostProps, 'time' | 'comments' | 'reported' | 'reportReason'> = {
    title: '',
    content: '',
    username: ''
  };
  