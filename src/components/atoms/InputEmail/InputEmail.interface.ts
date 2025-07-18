export interface InputEmailInterface {
  id?: string
  placeholder: string
  defaultValue?: string
  disabled?: boolean
  maxLength?: number
  showCount?: boolean
  status?: 'warning' | 'error'
  onChange?: (value: string) => void
}
