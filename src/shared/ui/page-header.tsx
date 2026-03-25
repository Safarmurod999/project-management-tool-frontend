import type { ReactNode } from 'react';
import { Breadcrumbs, Title, Text, Group, Anchor, Box } from '@mantine/core';
import { Link } from 'react-router-dom';

export interface PageBreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs: PageBreadcrumbItem[];
  title: string;
  description?: string;
  icon?: ReactNode;
  rightSection?: ReactNode;
}

export function PageHeader({
  breadcrumbs,
  title,
  description,
  icon,
  rightSection,
}: PageHeaderProps) {
  const breadcrumbItems = breadcrumbs.map((item, index) =>
    item.href ? (
      <Anchor key={`${item.label}-${index}`} component={Link} to={item.href}>
        {item.label}
      </Anchor>
    ) : (
      <span key={`${item.label}-${index}`}>{item.label}</span>
    ),
  );

  return (
    <Box mb="lg">
      <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>

      <Group align="flex-end" justify="space-between" my="xl">
        <Group align="center" gap="xs">
          {icon}
          <div>
            <Title order={1} size={32} fw={700}>
              {title}
            </Title>
            {description ? (
              <Text c="dimmed" size="sm">
                {description}
              </Text>
            ) : null}
          </div>
        </Group>

        {rightSection ? <div>{rightSection}</div> : null}
      </Group>
    </Box>
  );
}
