  // Define ValidationRule type or import it from the correct module
  export type ValidationRule = unknown; // Replace 'unknown' with the actual type if available

  export interface FormField {
    name: string;
    label?: string;
    type: 'text'| 'password'| 'email'| 'textarea'| 'select'| 'checkbox'| 'radio'| 'file'| 'image'| 'number'| 'toggle' | 'image-group' | 'multi-select';
    required?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: {label:string,value:any}[];      // For select, checkbox, radio
    dynamic?:boolean;
    placeholder?: string;    // For text, textarea, select
    accept?: string;         // For file/image
    validationRule?: ValidationRule; // Basic type-based validation via Zod
    defaultValue?: string | number | boolean | null; // Default value for the field
  }