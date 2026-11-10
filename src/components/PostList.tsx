import ThemeRoot from '../theme/ThemeRoot';
import EmptyState from './EmptyState';
import PostRows from './PostRows';
import TagChips from './TagChips';
import type { PostSummary, TagCount } from '../data/posts';
import { text } from '../data/text';

interface Props {
  posts: PostSummary[];
  /** Tag filter shown above the list. */
  tags?: TagCount[];
  activeTag?: string;
}

export default function PostList({ posts, tags = [], activeTag }: Props) {
  return (
    <ThemeRoot>
      <TagChips tags={tags} active={activeTag} allHref="/posts/" />
      {posts.length > 0 ? <PostRows posts={posts} /> : <EmptyState>{text.posts.empty}</EmptyState>}
    </ThemeRoot>
  );
}
