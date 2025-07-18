export interface InputNumberInterface {
  id?: string
  placeholder: string
  defaultValue?: number
  disabled?: boolean
  max?: number
  min?: number
  status?: 'warning' | 'error'
  onChange?: (value: string) => void
}
