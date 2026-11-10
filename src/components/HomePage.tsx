import ArrowForward from '@mui/icons-material/ArrowForward';
import MailOutlined from '@mui/icons-material/MailOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import LinkIcon from './LinkIcon';
import CardGrid from './CardGrid';
import HobbyCategoryCard from './HobbyCategoryCard';
import NowCard, { type NowSummary } from './NowCard';
import PostRows from './PostRows';
import ProjectCard from './ProjectCard';
import SectionHeader from './SectionHeader';
import ServiceCard from './ServiceCard';
import { profile } from '../data/profile';
import type { HobbyCategory } from '../data/hobbies';
import type { PostSummary } from '../data/posts';
import type { ProjectSummary } from '../data/projects';
import type { Service } from '../data/services';
import { text } from '../data/text';

interface Props {
  hobbies: HobbyCategory[];
  now?: NowSummary | undefined;
  posts: PostSummary[];
  projects: ProjectSummary[];
  services: Service[];
}

const sectionSx = { mt: { xs: 5, md: 6 } };

export default function HomePage({ hobbies, now, posts, projects, services }: Props) {
  return (
    <ThemeRoot>
      {/* The Now card sits beside the introduction on wide screens instead of below it. */}
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 3, md: 4 },
          alignItems: 'center',
          gridTemplateColumns: { xs: '1fr', md: now ? 'minmax(0, 1fr) minmax(0, 400px)' : '1fr' },
          py: { xs: 1, md: 2 },
        }}
      >
        <Box component="section">
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' } }}>
            {profile.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 640, fontSize: '1.125rem' }}>
            {profile.tagline}
          </Typography>
          <Stack direction="row" useFlexGap sx={{ mt: 3, flexWrap: 'wrap', gap: 1.5 }}>
            {profile.links.map((link) => (
              <Button
                key={link.href}
                variant="outlined"
                href={link.href}
                rel="me noopener"
                startIcon={<LinkIcon href={link.href} />}
              >
                {link.label}
              </Button>
            ))}
            {profile.email && (
              <Button
                variant="outlined"
                href={`mailto:${profile.email}`}
                startIcon={<MailOutlined />}
              >
                {text.home.emailButton}
              </Button>
            )}
            <Button href="/about/" endIcon={<ArrowForward />}>
              {text.home.aboutButton}
            </Button>
          </Stack>
        </Box>
        {now && <NowCard now={now} />}
      </Box>

      <Box component="section" aria-labelledby="services-heading" sx={sectionSx}>
        <SectionHeader
          id="services-heading"
          title={text.home.services.title}
          more={{ href: '/services/', label: text.home.services.more }}
        />
        <CardGrid>
          {services.map((service) => (
            <li key={service.url}>
              <ServiceCard service={service} />
            </li>
          ))}
        </CardGrid>
      </Box>

      {posts.length > 0 && (
        <Box component="section" aria-labelledby="posts-heading" sx={sectionSx}>
          <SectionHeader
            id="posts-heading"
            title={text.home.posts.title}
            more={{ href: '/posts/', label: text.home.posts.more }}
          />
          <PostRows posts={posts} />
        </Box>
      )}

      {projects.length > 0 && (
        <Box component="section" aria-labelledby="projects-heading" sx={sectionSx}>
          <SectionHeader
            id="projects-heading"
            title={text.home.projects.title}
            more={{ href: '/projects/', label: text.home.projects.more }}
          />
          <CardGrid columns={2}>
            {projects.map((project) => (
              <li key={project.href}>
                <ProjectCard project={project} />
              </li>
            ))}
          </CardGrid>
        </Box>
      )}

      <Box component="section" aria-labelledby="hobbies-heading" sx={sectionSx}>
        <SectionHeader
          id="hobbies-heading"
          title={text.home.hobbies.title}
          more={{ href: '/hobbies/', label: text.home.hobbies.more }}
        />
        <CardGrid>
          {hobbies.map((category) => (
            <li key={category.id}>
              <HobbyCategoryCard category={category} />
            </li>
          ))}
        </CardGrid>
      </Box>
    </ThemeRoot>
  );
}
