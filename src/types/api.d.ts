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

type BucketDetail = {
  comment: string;
  creationDate: string;
  blockPublicAccess: string;
  location: string;
  name: string;
  owner: {
    displayName: string;
    id: string;
  };
};

// type BucketFile = {
//   etag: string;
//   lastModified: string;
//   name: string;
//   owner?: any;
//   size: number;
//   storageClass: 'Standard';
//   type: 'Normal';
//   url: string;
// };

declare namespace ModelType {
  type User = {
    id: number;
    username: string;
  };
  type BucketFile = {
    id: string;
    bucketName: string;
    bucketRegion: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    dirId?: string;
    directory?: BucketFileDir;
    cacheControl?: number;
    size?: number;
    description?: string;
    updatedBy?: User['id'];
    updater?: User;
    createdBy?: User['id'];
    creator?: User;
    updatedAt?: number;
    createdAt: number;
  };

  type BucketFileDir = {
    id: string;
    name: string;
    bucketName: string;
    bucketRegion: string;
    parentDirId?: string;
    description?: string;

    updatedBy?: User['id'];
    updater?: User;
    createdBy?: User['id'];
    creator?: User;

    updatedAt?: number;
    createdAt: number;
  };
}
