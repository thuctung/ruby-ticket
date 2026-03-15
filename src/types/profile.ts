export type ProfileType = {
  user_id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role:string;
  status: string;
  created_at?:string | null
};




export type ProfileUpdateStatusType = {
  user_id: string;
  status: string;
}