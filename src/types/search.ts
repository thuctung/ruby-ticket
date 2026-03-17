
export interface SearchTableType<T = object> {
  currentPage: number;
  searchValue: T;
  user_id?: string,
}

export interface SearchAffiType {
    status?: string ,
    username?:string ,
    email?:string 
}

export interface SearchTraction  {
  type?:string,
  from:string,
  to:string
}