export interface UserInterface {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  updateAt: string
}

export interface LoginUserInterface {
  email: string
  password: string
  remember: boolean
}

export interface LoginUserResponseInterface {
  user: UserInterface
  access_token: string
}

export interface SignInUserInterface {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export interface UpdateUserInterface {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
}
