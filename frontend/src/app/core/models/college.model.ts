export interface College {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  email: string;
  phoneNumber: string;
  createdAt?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  college?: College;
}