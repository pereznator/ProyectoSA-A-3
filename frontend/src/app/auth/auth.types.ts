// export interface User {
//   id: number;
//   tipoUsuario: string;
//   email: string;
//   emailVerified: boolean;
//   estado: string;
//   username: string;
// }



export interface Address {
  address: string;
  city: string;
  department: string;
  is_primary: number; // también podrías usar boolean si lo prefieres
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  dob: string;
  gender: 'male' | 'female' | 'other'; // ajustable según necesidades
  role: 'admin' | 'user' | 'moderator'; // puedes agregar más roles según tu app
  profile_picture: string | null;
  addresses: Address[];
}
