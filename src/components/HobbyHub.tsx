import ThemeRoot from '../theme/ThemeRoot';
import CardGrid from './CardGrid';
import HobbyCategoryCard from './HobbyCategoryCard';
import PageHeader from './PageHeader';
import RelatedPosts from './RelatedPosts';
import type { HobbyCategory, HobbyCategoryId } from '../data/hobbies';
import type { PostSummary } from '../data/posts';
import { fill, text } from '../data/text';

interface Props {
  categories: HobbyCategory[];
  counts: Record<HobbyCategoryId, number>;
  posts: PostSummary[];
}

export default function HobbyHub({ categories, counts, posts }: Props) {
  return (
    <ThemeRoot>
      <PageHeader title={text.hobbies.title} />
      <CardGrid>
        {categories.map((category) => (
          <li key={category.id}>
            <HobbyCategoryCard
              category={category}
              countLabel={
                counts[category.id] > 0
                  ? fill(
                      category.id === 'photos'
                        ? text.hobbies.photos.albumCount
                        : text.hobbies.entryCount,
                      { count: counts[category.id] },
                    )
                  : undefined
              }
            />
          </li>
        ))}
      </CardGrid>
      <RelatedPosts posts={posts} />
    </ThemeRoot>
  );
}
