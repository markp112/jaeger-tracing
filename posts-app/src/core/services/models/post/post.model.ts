import { Post } from '@prisma/client';

interface PostType extends Post {
  id: string;
  post: string;
  date: Date;
}

export { PostType };
