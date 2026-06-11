import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'UI/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    type: {
      control: 'select',
      options: ['button', 'submit'],
      description: 'HTML button type attribute',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    className: '',
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Default: Story = {
  name: 'Primary',
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [type]="type" [disabled]="disabled" [className]="className">Haz tu pedido</app-button>`,
  }),
};

export const Secondary: Story = {
  args: {
    ...meta.args,
    variant: 'secondary',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [type]="type" [disabled]="disabled" [className]="className">Ver menú</app-button>`,
  }),
};

export const Ghost: Story = {
  args: {
    ...meta.args,
    variant: 'ghost',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [type]="type" [disabled]="disabled" [className]="className">Cancelar</app-button>`,
  }),
};

export const Danger: Story = {
  args: {
    ...meta.args,
    variant: 'danger',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [type]="type" [disabled]="disabled" [className]="className">Eliminar</app-button>`,
  }),
};

export const Sizes: Story = {
  args: {
    ...meta.args,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-center gap-4">
        <app-button [variant]="variant" size="sm" [type]="type" [disabled]="disabled" [className]="className">Pequeño</app-button>
        <app-button [variant]="variant" size="md" [type]="type" [disabled]="disabled" [className]="className">Mediano</app-button>
        <app-button [variant]="variant" size="lg" [type]="type" [disabled]="disabled" [className]="className">Grande</app-button>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    ...meta.args,
    disabled: true,
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [type]="type" [disabled]="disabled" [className]="className">Deshabilitado</app-button>`,
  }),
};
