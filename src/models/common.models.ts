export interface PaginatedResponse<T> extends PaginationMetadata{
    content:T[],
    
}

export interface PaginationMetadata {
    page: number;
    totalElements: number;
    totalPages: number;
    size: number;
}