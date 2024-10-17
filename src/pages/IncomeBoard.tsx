import { Form } from "react-bootstrap"
import { axiosInstance } from "../utility/axiosInstance";
import { getAuthHeader } from "../utility/authHelper";
import { LoggedInUser } from "../models/user.models";
import { useAppSelector } from "../store/store";
import { useEffect, useState } from "react";
import { Income, IncomeByIncomeSource, IncomeSummary } from "../models/income.models";
import { PaginatedResponse } from "../models/common.models";

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
    const getRecentIncomes = async ({
        page=1, size=null
    }:{page?:number, size?:number|null})=>{
        try{
            const pageFinalSize = size? size : pageSize
            const response = await axiosInstance.get(`/expenses?page=${page}&&size=${pageFinalSize}`, getAuthHeader(loggedinUser))
            setIncomeList(response.data);
        }catch(err){
            console.log('could not fetch dashboard data, error=',err);
        }
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
                    <h2>My income total this month: ${incomeSummary?.totalIncomeThisMonth}</h2>
                    <p>Change from last month : <strong> {incomeSummary?.totalIncomeThisMonth > incomeSummary?.totalIncomeLastMonth ? '+': '-'}$ {Math.abs(incomeSummary?.totalIncomeThisMonth-incomeSummary?.totalIncomeLastMonth)} </strong></p>
                    <p>Predicted income from budget: $<strong>{incomeSummary.budgetedIncomeThisMonth} </strong> </p>
                    </>
                }
                
            </div>
            <div>
                <div className="d-flex flex-column pe-4" >
                    <h3 className="d-inline p-0 m-0"> My income by sources</h3>
                    <button className="btn btn-success align-self-end me-4" >Add new income source</button>
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
                    <h3 className="d-inline p-0 m-0"> My reproted incomes this month</h3>
                    <button className="btn btn-success align-self-end me-4" >Add new income </button>
            </div>
            <div style={{display:"flex", alignItems:"center"}}>
                
                    <label htmlFor="entriesPerPage">Show</label>
                    <Form.Select aria-label="Default select example" className="mx-2" style={{width:"80px"}}>
                    <option value="1">5</option>
                    <option value="2">10</option>
                    <option value="3">15</option>
                    </Form.Select>
                    <label htmlFor="entriesPerPage">entries per page</label>
               
            </div>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <th scope="row">3</th>
                    <td colSpan={2}>Larry the Bird</td>
                    <td>@twitter</td>
                    </tr>
                </tbody>
            </table>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item"><a className="page-link" href="#">Next</a></li>
                </ul>
            </nav>
        </div>
    )
}