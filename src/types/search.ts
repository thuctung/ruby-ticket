
export interface SearchTableType<T = object> {
  currentPage: number;
  searchValue: T;
}

export interface SearchAffiType {
    status?: string ,
    username?:string ,
    email?:string 
}