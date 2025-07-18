export interface SegmentedInterface {
  block?: boolean
  disabled?: boolean
  options: string[] | number[]
  value: string | number
  onChange?: (value: string | number) => void
}
