import React, { useEffect } from "react";
import { PaginationMetadata } from "../../models/common.models"
import { getPageNumbers } from "../../utility/datehelper"

type PageSectionProps = {
    pagedList: PaginationMetadata;
    onPageChange: (pageNumber: number) => void;
}

export const PageSection:React.FC<PageSectionProps> = ({pagedList, onPageChange}:PageSectionProps)=>{


    useEffect(() => {
        console.log('pagedList:', pagedList);
        console.log('onPageChange:', onPageChange);
    }, [pagedList, onPageChange]);

    return(
        <div>
            {pagedList.totalElements > pagedList.size &&
            <>
                <nav aria-label="Page navigation area">
                    <ul className="pagination">
                    {pagedList.number > 1 ? 
                        <li className="page-item">
                            <a className="page-link" href="#">Previous</a>
                        </li>
                        :
                        <li className="page-item disabled">
                            <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">Previous</a>
                        </li>
                    }
                    
                    {getPageNumbers(pagedList.totalPages,pagedList.number).map((pageNumber) => (
                        <li key={pageNumber} className={`page-item ${pageNumber === pagedList.number ? 'disabled' : ''}`}>
                            <a className="page-link" href="#" onClick={() => onPageChange(pageNumber)}>{pageNumber}</a>
                        </li>
                    ))}

                      
                        <li className={`page-item ${pagedList.number === pagedList.totalPages ? 'disabled' : ''}`}>
                            <a className="page-link" href="#" onClick={() => onPageChange(pagedList.number + 1)}>Next</a>
                        </li>
                    </ul>
                </nav>
            </>
            }
        </div>
        
    )
}