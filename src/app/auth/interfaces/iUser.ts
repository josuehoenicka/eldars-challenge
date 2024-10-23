import { iRol } from '../../common/interfaces/iRol';

export interface iUser {
  email: string;
  password: string;
  role: iRol;
  token: string;
}
