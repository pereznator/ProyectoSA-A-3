export interface User {
  id: number;
  tipoUsuario: string;
  email: string;
  emailVerified: boolean;
  estado: string;
  username: string;
  idCarrito?: string;
}