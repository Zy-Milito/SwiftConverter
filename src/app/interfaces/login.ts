export interface ILogin {
  username: string;
  password: string;
}

export interface IResLogin {
  status: string;
  message: string;
  token?: string;
}
