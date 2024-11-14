export interface PaginatedResponse<T> extends PaginationMetadata{
    content:T[],
    
}

export interface PaginationMetadata {
    totalElements: number;
    totalPages: number;
    number: number;
    size:number;
    last?:boolean;
}