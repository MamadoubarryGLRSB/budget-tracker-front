export interface CheckboxInterface {
  id?: string
  placeholder: string
  checked?: boolean
  disabled?: boolean
  value?: boolean
  onChange?: (value: boolean) => void
}
