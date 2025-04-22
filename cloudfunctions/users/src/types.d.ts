export interface User {
  _id?: string;
  openId: string;
  nickName?: string;
  avatarUrl?: string;
  gender?: number;
  country?: string;
  province?: string;
  city?: string;
  language?: string;
  phoneNumber?: string;
  email?: string;
  createTime: number;
  updateTime: number;
  lastLoginTime: number;
}
