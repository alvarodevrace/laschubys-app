import { FormControl } from '@angular/forms';

export interface CheckoutForm {
  name: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
  province: FormControl<string | null>;
  address: FormControl<string | null>;
}
