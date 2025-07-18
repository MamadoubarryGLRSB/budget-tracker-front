export interface InputPasswordInterface {
  id?: string
  placeholder: string
  defaultValue?: string
  disabled?: boolean
  maxLength?: number
  status?: 'warning' | 'error'
  onChange?: (value: string) => void
}
