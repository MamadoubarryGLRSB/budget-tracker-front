export interface ButtonInterface {
  block?: boolean
  danger?: boolean
  disabled?: boolean
  ghost?: boolean
  href?: string | object
  htmlType?: string
  loading?: boolean
  shape?: string
  size?: string
  target?: string
  type?: string
  click?: (event: Event) => void
}
