import { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { axiosInstance } from "../utility/axiosInstance"
import { getAuthHeader } from "../utility/authHelper"
import { LoggedInUser } from "../models/user.models"
import { useAppSelector } from "../store/store"
import {  CategoryExpense, Expense, FinancialSummary } from "../models/expense.models"
import { PaginatedResponse } from "../models/common.models"
import { formatDate, getPageNumbers } from "../utility/datehelper"

export const Dashboard = ()=>{
    const loggedinUser:LoggedInUser|null = useAppSelector(
        (state)=> state.userSlice.loggedInUser //we can also listen to entire slice instead of loggedInUser of the userSlice
    )
    const [financialSummary, setFinancialSummary] = useState<FinancialSummary|null>(null);
    const [expenseList, setExpenseList] = useState<PaginatedResponse<Expense>|null>(null);
    const [pageSize, setPageSize] = useState<number>(5);
    const getOverViewData = async ()=>{
        try{
            const response = await axiosInstance.get('/income/overview', getAuthHeader(loggedinUser))
            setFinancialSummary(response.data);
        }catch(err){
            console.log('could not fetch dashboard data, error=',err);
        }
    }
    const getRecentExpenses = async ({
        page=1, size=null
    }:{page?:number, size?:number|null})=>{
        try{
            const pageFinalSize = size? size : pageSize
            const response = await axiosInstance.get(`/expenses?page=${page}&&size=${pageFinalSize}`, getAuthHeader(loggedinUser))
            setExpenseList(response.data);
        }catch(err){
            console.log('could not fetch dashboard data, error=',err);
        }
    }
    const onPageChange = async(pageNumber:number)=>{
        getRecentExpenses({page:pageNumber})
    }
    const handlePageSizeChange = (event:React.ChangeEvent<HTMLSelectElement> ) =>{
        console.log('i am being invoked', event.target.value)
        const selectedValue = event.target.value;
        const sizeHere = (parseInt(selectedValue)||1)
        setPageSize(sizeHere);
        getRecentExpenses({
          
            size:sizeHere
        });
    }
    useEffect(()=>{
        getOverViewData();
        getRecentExpenses({});
    },[]);

    return(
        <div className="row">
            <div className="card mt-1" style={{width:"98%"}}>
            
                <div className="card-body">
                    <h5 className="card-title">Monthly overview</h5>
                    <div className="row">
                        <div className="col card me-2" style={{background:"#D6EA76"}}>
                            Total income this month
                            <h3> $ {financialSummary && financialSummary.totalIncome}.00</h3>
                        </div>
                        <div className="col card me-2" style={{background:"#F5E0AF"}}>
                        Total expense this month
                        <h3> $ {financialSummary && financialSummary.totalExpense}.00</h3>
                        </div>
                        <div className="col card" style={{background:"#D3D1FE"}}>
                            Net Balance
                            <h3> $ {financialSummary && financialSummary.netBalance}.00</h3>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Top spending categories</h2>
            <div className="p-3">
                
                <div className="row" >
                    {financialSummary && financialSummary.topCategoryExpense.map((item:CategoryExpense,idx)=>{
                        return (
                            <div key={idx} className="col-2 card me-2" style={{background:"#D6EA76"}}>
                                <h5>{ item.category_id!==0? item.category_name: 'Uncategorized'}</h5>
                                <p>$ {item.category_cost}</p>
                            </div>
                        )
                    })}
                    
                    
                </div>
            </div>
            <h2>Recent Expenses</h2>
            {(!expenseList || expenseList.content.length===0) && 
            <p>
                No reported Expense Yet
            </p>
            }
            {(expenseList && expenseList.content.length>0) &&
                <>
                     <div style={{display:"flex", alignItems:"center"}}>
                
                        <label htmlFor="entriesPerPage">Show</label>
                        <Form.Select 
                            aria-label="Default select example" 
                            className="mx-2" 
                            style={{width:"80px"}}
                            onChange={handlePageSizeChange}
                            value={pageSize}
                        >
                            <option value="5" >5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </Form.Select>
                         <label htmlFor="entriesPerPage">entries per page</label>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Category</th>
                            <th scope="col">Spent</th>
                            <th scope="col">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseList.content.map((item:Expense,idx)=>{
                                return(
                                    <tr key={idx}>
                                        <th scope="row">{idx+1}</th>
                                        <td>{item.category ?item.category?.name : 'Uncategorized'}</td>
                                        <td>{item.cost.toString()}</td>
                                        <td>{formatDate(item.dateTime)}</td>
                                    </tr>
                                )
                            })}
                            
                            
                        </tbody>
                    </table>
                    {expenseList.totalElements > expenseList.size &&
                        <>
                            <nav aria-label="Page navigation area">
                                <ul className="pagination">
                                {expenseList.page > 1 ? 
                                    <li className="page-item">
                                        <a className="page-link" href="#">Previous</a>
                                    </li>
                                    :
                                    <li className="page-item disabled">
                                        <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">Previous</a>
                                    </li>
                                }
                                
                                {getPageNumbers(expenseList.totalPages,expenseList.page).map((pageNumber) => (
                                    <li key={pageNumber} className={`page-item ${pageNumber === expenseList.page ? 'disabled' : ''}`}>
                                        <a className="page-link" href="#" onClick={() => onPageChange(pageNumber)}>{pageNumber}</a>
                                    </li>
                                ))}

                                  
                                    <li className={`page-item ${expenseList.page === expenseList.totalPages ? 'disabled' : ''}`}>
                                        <a className="page-link" href="#" onClick={() => onPageChange(expenseList.page + 1)}>Next</a>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    }
                    
                </>
            }
           
        </div>
    )
}