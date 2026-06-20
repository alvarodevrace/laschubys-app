import type { Meta, StoryObj } from '@storybook/angular';
import { CardComponent } from './card.component';

const meta: Meta<CardComponent> = {
  title: 'UI/Card',
  component: CardComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated'],
      description: 'Visual style variant of the card',
    },
    padding: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Internal spacing of the card',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [variant]="variant" [padding]="padding">
        <h3 class="text-lg font-semibold text-foreground">Card Title</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          This is an example card content. Use the controls to preview different variants.
        </p>
      </app-card>
    `,
  }),
};

export default meta;
type Story = StoryObj<CardComponent>;

export const Default: Story = {
  name: 'Default',
  args: {
    variant: 'default',
    padding: 'md',
  },
};

export const Bordered: Story = {
  name: 'Bordered',
  args: {
    variant: 'bordered',
    padding: 'md',
  },
};

export const Elevated: Story = {
  name: 'Elevated',
  args: {
    variant: 'elevated',
    padding: 'md',
  },
};

export const PaddingSizes: Story = {
  name: 'Padding Sizes',
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <app-card variant="bordered" padding="sm">
          <p class="text-sm text-muted-foreground">Small padding (p-4)</p>
        </app-card>
        <app-card variant="bordered" padding="md">
          <p class="text-sm text-muted-foreground">Medium padding (p-6)</p>
        </app-card>
        <app-card variant="bordered" padding="lg">
          <p class="text-sm text-muted-foreground">Large padding (p-8)</p>
        </app-card>
      </div>
    `,
  }),
};
