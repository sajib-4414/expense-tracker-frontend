export interface PaginatedResponse<T> {
    content:T[],
    page: number,
    totalElements: number,
    totalPages: number,
    size:number
}