import { Form } from "react-bootstrap"
import { LoggedInUser } from "../models/user.models"
import { useAppSelector } from "../store/store";
import { useEffect, useState } from "react";
import { CategoryExpense, Expense, ExpenseBoardSummary } from "../models/expense.models";
import { PaginatedResponse } from "../models/common.models";
import { axiosInstance } from "../utility/axiosInstance";
import { getAuthHeader } from "../utility/authHelper";
import { formatDate } from "../utility/datehelper";
import { PageSection } from "../components/common/PageSection";
export const ExpenseBoard = ()=>{
    const loggedinUser:LoggedInUser|null = useAppSelector(
        (state)=> state.userSlice.loggedInUser //we can also listen to entire slice instead of loggedInUser of the userSlice
    )
    const [expenseBoardSummary, setExpenseBoardSummary] = useState<ExpenseBoardSummary|null>(null);
    const [expenseList, setExpenseList] = useState<PaginatedResponse<Expense>|null>(null);
    const [pageSize, setPageSize] = useState<number>(5);
    const getOverViewData = async ()=>{
        try{
            const response = await axiosInstance.get('/expenses/summary', getAuthHeader(loggedinUser))
            setExpenseBoardSummary(response.data);
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
        <div>
            <div className="card mt-2 p-1" style={{background:"#D6EA76", width: "90%"}}>
                <h2>My total expenditure: {expenseBoardSummary?.totalExpenseThisMonth}.00 $</h2>
                <p>
                {
                    expenseBoardSummary && Math.abs(expenseBoardSummary?.totalExpenseThisMonth- expenseBoardSummary?.totalExpenseLastMonth)>0 &&
                    'Increased'
                }
                {
                    expenseBoardSummary && Math.abs(expenseBoardSummary?.totalExpenseThisMonth- expenseBoardSummary?.totalExpenseLastMonth)<=0 &&
                    'Decreased'
                }
                 
                    from last month : <strong>{expenseBoardSummary && Math.abs(expenseBoardSummary?.totalExpenseThisMonth- expenseBoardSummary?.totalExpenseLastMonth)}.00 $ </strong></p>
                    <p>Total budget spent <strong>{expenseBoardSummary && ((expenseBoardSummary.totalExpenseThisMonth / expenseBoardSummary.budgetedExpenseThisMonth) * 100).toFixed(2)}%</strong></p>

                
                
            </div>
            <div>
                <h3 className="p-0 m-0"> My expenses by sources</h3>
                
                <div className="p-3">
                
                    <div className="row" >
                        {expenseBoardSummary && expenseBoardSummary.categoryWiseExpense.map((item:CategoryExpense,idx)=>{
                            return (
                                <div key={idx} className="col-2 card me-2" style={{background:"#D6EA76"}}>
                                    <h5>{ item.category_id!==0? item.category_name: 'Uncategorized'}</h5>
                                    <p>$ {item.category_cost}</p>
                                </div>
                            )
                        })}
                        
                        
                    </div>
                </div>
            </div>

            
            <div className="d-flex flex-column pe-4" >
                    <h3 className="d-inline p-0 m-0"> My recent expenses</h3>
                    <button className="btn btn-success align-self-end me-4" >Add new expense </button>
            </div>
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
                            <PageSection
                            pagedList={expenseList}
                            onPageChange={onPageChange}
                            />
                    
                </>
            }
        </div>
    )
}