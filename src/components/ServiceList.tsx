import ThemeRoot from '../theme/ThemeRoot';
import CardGrid from './CardGrid';
import EmptyState from './EmptyState';
import ServiceCard from './ServiceCard';
import type { Service } from '../data/services';
import { text } from '../data/text';

export default function ServiceList({ services }: { services: Service[] }) {
  return (
    <ThemeRoot>
      {services.length > 0 ? (
        <CardGrid columns={2}>
          {services.map((service) => (
            <li key={service.url}>
              <ServiceCard service={service} detailed />
            </li>
          ))}
        </CardGrid>
      ) : (
        <EmptyState>{text.services.empty}</EmptyState>
      )}
    </ThemeRoot>
  );
}
