import {  Form } from "react-bootstrap"
import { axiosInstance } from "../utility/axiosInstance";
import { getAuthHeader } from "../utility/authHelper";
import { LoggedInUser } from "../models/user.models";
import { useAppSelector } from "../store/store";
import { useEffect, useState } from "react";
import { Income, IncomeByIncomeSource, IncomeSummary } from "../models/income.models";
import { PaginatedResponse } from "../models/common.models";
import { formatDate } from "../utility/datehelper"
import { PageSection } from "../components/common/PageSection";

export const IncomeBoard = ()=>{
    const loggedinUser:LoggedInUser|null = useAppSelector(
        (state)=> state.userSlice.loggedInUser //we can also listen to entire slice instead of loggedInUser of the userSlice
    )
    const [incomeSummary, setIncomeSummary] = useState<IncomeSummary|null>(null);
    const [incomeList, setIncomeList] = useState<PaginatedResponse<Income>|null>(null);
    const [pageSize, setPageSize] = useState<number>(5);
    

   
    
      

    const getOverViewData = async ()=>{
        try{
            const response = await axiosInstance.get('/income/summary', getAuthHeader(loggedinUser))
            setIncomeSummary(response.data);
        }catch(err){
            console.log('could not fetch dashboard data, error=',err);
        }
    }
    const handlePageSizeChange = (event:React.ChangeEvent<HTMLSelectElement> ) =>{
        console.log('i am being invoked', event.target.value)
        const selectedValue = event.target.value;
        const sizeHere = (parseInt(selectedValue)||1)
        setPageSize(sizeHere);
        getRecentIncomes({
          
            size:sizeHere
        });
    }
    const getRecentIncomes = async ({
        page=1, size=null
    }:{page?:number, size?:number|null})=>{
        try{
            const now = new Date();
            const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11, so add 1
            const currentYear = now.getFullYear();
            const pageFinalSize = size? size : pageSize
            const response = await axiosInstance.get(`/income?page=${page}&&size=${pageFinalSize}&&month=${currentMonth}&&year=${currentYear}`, getAuthHeader(loggedinUser))
            setIncomeList(response.data);
        }catch(err){
            console.log('could not fetch dashboard data, error=',err);
        }
    }
    const onPageChange = async(pageNumber:number)=>{
        getRecentIncomes({page:pageNumber})
    }

    useEffect(()=>{
        getOverViewData();
        getRecentIncomes({});
    },[]);


    return(
        <div>

            


            <div className="card mt-2 p-1" style={{background:"#D6EA76", width: "90%"}}>
                {incomeSummary &&
                    <>
                    <h2>Total income this month: ${incomeSummary?.totalIncomeThisMonth}</h2>
                    <p>Change from last month : <strong> {incomeSummary?.totalIncomeThisMonth > incomeSummary?.totalIncomeLastMonth ? '+': '-'}$ {Math.abs(incomeSummary?.totalIncomeThisMonth-incomeSummary?.totalIncomeLastMonth)} </strong></p>
                    <p>Predicted income from budget: $<strong>{incomeSummary.budgetedIncomeThisMonth} </strong> </p>
                    </>
                }
                
            </div>
            <div>
                <div className="d-flex flex-column pe-4" >
                    <h3 className="d-inline p-0 m-0"> Total income by source</h3>
                    
                </div>
                
                <div className="p-3">
                
                    <div className="row" >
                        {incomeSummary && incomeSummary.incomeListBySource.map((item:IncomeByIncomeSource,idx)=>{
                            return(
                                <div key={idx} className="col-2 card me-2" style={{background:"#D6EA76"}}>
                                    <h5>{ item.income_source_id >0 ? item.income_source_name: 'Uncategorized'} </h5>
                                    <p>$ {item.income_total}</p>
                                </div>
                            )
                        })}
                        
                      
                        
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column pe-4" >
                    <h3 className="d-inline p-0 m-0"> All Incomes this month</h3>
                    <button className="btn btn-success align-self-end me-4" >Add new income </button>
            </div>
            {(!incomeList || incomeList.content.length===0) && 
            <p>
                No reported Incomes Yet this month.
            </p>
            }
             {(incomeList && incomeList.content.length>0) &&
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
                            <th scope="col">Source</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {incomeList.content.map((item:Income,idx)=>{
                                return(
                                    <tr key={idx}>
                                        <th scope="row">{idx+1}</th>
                                        <td>{item.incomeSource ?item.incomeSource?.name : 'Uncategorized'}</td>
                                        <td>{item.amount.toString()}</td>
                                        <td>{formatDate(item.dateTime)}</td>
                                    </tr>
                                )
                            })}
                            
                            
                           
                        </tbody>
                    </table>
                    <PageSection
                            pagedList={incomeList}
                            onPageChange={onPageChange}
                    />

                </>}
            
            
                
        </div>
    )
}