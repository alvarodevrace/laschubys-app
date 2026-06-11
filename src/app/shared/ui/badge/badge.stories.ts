import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'UI/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'Visual style variant of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size of the badge',
    },
  },
  render: (args) => ({
    props: args,
    template: `<app-badge [variant]="variant" [size]="size">Badge</app-badge>`,
  }),
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    variant: 'default',
    size: 'sm',
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-4">
        <app-badge variant="default">Default</app-badge>
        <app-badge variant="outline">Outline</app-badge>
        <app-badge variant="ghost">Ghost</app-badge>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-4">
        <app-badge size="sm">Small</app-badge>
        <app-badge size="md">Medium</app-badge>
      </div>
    `,
  }),
};
