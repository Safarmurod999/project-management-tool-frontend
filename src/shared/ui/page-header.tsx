import type { ReactNode } from 'react';
import { Anchor, Box, Breadcrumbs, Group, Text, ThemeIcon, Title } from '@mantine/core';
import { ChevronRight } from 'lucide-react';
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
      <Anchor
        key={`${item.label}-${index}`}
        component={Link}
        to={item.href}
        size="sm"
        c="dimmed"
        underline="hover"
      >
        {item.label}
      </Anchor>
    ) : (
      <Text key={`${item.label}-${index}`} size="sm" fw={500}>
        {item.label}
      </Text>
    ),
  );

  return (
    <Box mb="xl">
      <Breadcrumbs separator={<ChevronRight size={14} />} separatorMargin={6}>
        {breadcrumbItems}
      </Breadcrumbs>

      <Group align="center" justify="space-between" mt="md" gap="md">
        <Group align="center" gap="md" wrap="nowrap" style={{ minWidth: 0 }}>
          {icon ? (
            <ThemeIcon size={46} radius="lg" variant="light" color="brand">
              {icon}
            </ThemeIcon>
          ) : null}
          <div style={{ minWidth: 0 }}>
            <Title order={1} fz={{ base: 20, sm: 24 }} lh={1.2} style={{ letterSpacing: '-0.02em' }}>
              {title}
            </Title>
            {description ? (
              <Text c="dimmed" size="sm" mt={4}>
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
