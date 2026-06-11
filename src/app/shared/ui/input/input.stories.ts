import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'UI/Input',
  component: InputComponent,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label displayed above the input',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'textarea', 'select'],
      description: 'Type of input field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    options: {
      control: 'object',
      description: 'Options for select type (array of strings)',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the input',
    },
  },
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Default: Story = {
  args: {
    label: 'Nombre completo',
    type: 'text',
    placeholder: 'Ingresa tu nombre',
    required: false,
    options: [],
    error: '',
  },
};

export const Email: Story = {
  args: {
    label: 'Correo electrónico',
    type: 'email',
    placeholder: 'ejemplo@correo.com',
    required: true,
    options: [],
    error: '',
  },
};

export const Tel: Story = {
  args: {
    label: 'Teléfono',
    type: 'tel',
    placeholder: '+51 999 999 999',
    required: false,
    options: [],
    error: '',
  },
};

export const Textarea: Story = {
  args: {
    label: 'Mensaje',
    type: 'textarea',
    placeholder: 'Escribe tu mensaje aquí...',
    required: false,
    options: [],
    error: '',
  },
};

export const Select: Story = {
  args: {
    label: 'Tipo de pedido',
    type: 'select',
    placeholder: 'Selecciona una opción',
    required: true,
    options: ['Delivery', 'Recojo en tienda', 'Mesa'],
    error: '',
  },
};

export const WithError: Story = {
  args: {
    label: 'Correo electrónico',
    type: 'email',
    placeholder: 'ejemplo@correo.com',
    required: true,
    options: [],
    error: 'El correo ingresado no es válido',
  },
};
