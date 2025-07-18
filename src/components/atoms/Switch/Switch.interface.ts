export interface SwitchInterface {
  id: string
  placeholder: string
  checked?: boolean
  checkedChildren?: string
  disabled?: boolean
  loading?: boolean
  unCheckedChildren?: string
  onChange?: (value: boolean) => void
}
