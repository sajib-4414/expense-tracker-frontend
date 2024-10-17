export const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const daySuffix = (day:number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    return `${day}${daySuffix(day)} ${month} ${year}`;
};

export const getPageNumbers = (totalPages:number, page:number) => {
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);

    if (page <= half) {
        end = Math.min(totalPages, maxPagesToShow);
    } else if (page + half >= totalPages) {
        start = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
};