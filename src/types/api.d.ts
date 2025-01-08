/// <reference types="vite/client" />

type LoginData = {
  user: UserDetail;
  token: string;
};

type UserDetail = {
  id: number;
  username: string;
  avatar?: string;
  role: RoleValue;
  auth: number[];
};

type RoleValue = {
  id: number;
  name: string;
  description?: string;
};

type AuthValue = {
  id: number;
  name: string;
  description?: string;
};

type UserListItem = {
  id: number;
  username: string;
  destroyed: boolean;
  role: {
    id: number;
    name: string;
    description: string;
  };
  // auth: {
  //   id: number;
  //   name: string;
  //   description: string;
  // }[];
};

type RoleItem = {
  id: number;
  name: string;
  description: string;
  auth: AuthItem[];
};

type AuthItem = {
  id: number;
  name: string;
  description: string;
};
