import { Button, Dropdown, Form, Modal } from "react-bootstrap"
import { LoggedInUser } from "../models/user.models"
import { useAppSelector } from "../store/store";
import { useEffect, useState } from "react";
import { Category, CategoryExpense, Expense, ExpenseBoardSummary, ExpensePayload } from "../models/expense.models";
import { PaginatedResponse } from "../models/common.models";
import { axiosInstance } from "../utility/axiosInstance";
import { getAuthHeader } from "../utility/authHelper";
import { PageSection } from "../components/common/PageSection";

export const ExpenseBoard = ()=>{
    const loggedinUser:LoggedInUser|null = useAppSelector(
        (state)=> state.userSlice.loggedInUser //we can also listen to entire slice instead of loggedInUser of the userSlice
    )
    const [expenseBoardSummary, setExpenseBoardSummary] = useState<ExpenseBoardSummary|null>(null);
    const [expenseList, setExpenseList] = useState<PaginatedResponse<Expense>|null>(null);
    const [pageSize, setPageSize] = useState<number>(5);
    const [showExpenseCreateUpdateModal, setShowExpenseCreateUpdateModal] = useState(false);
    const [categoryList, setcategoryList] = useState<PaginatedResponse<Category>|null>(null);
    const [editingExpenseId, setEditingExpenseId] = useState<number>(0);
    const getOverViewData = async ()=>{
        try{
            const response = await axiosInstance.get('/expenses/summary', getAuthHeader(loggedinUser))
            setExpenseBoardSummary(response.data);
        }catch(err){
            console.log('could not fetch dashboard data, error=',err);
        }
    }
    const [expensePayload, setExpensePayload] = useState<ExpensePayload>({
        category_id:0,
        cost:0,
        notes:"",
        dateTime:""
    });
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
    const cancelCreateUpdateExpense = ()=>{
        setShowExpenseCreateUpdateModal(false);
        setExpensePayload({
            category_id:0,
            cost:0,
            notes:"",
            dateTime:""
        });
    }
    const selectCategory = (option:string|null)=>{
        if(option !=null){
            const categoryChosen:Category|undefined = categoryList?.content.find(item=>item.id===Number(option));
            if(categoryChosen){
                console.log("chosen=",categoryList?.content.find(item=>item.id===Number(option)));
                
               
                    setExpensePayload({...expensePayload,category_id:Number(option)})
                
            }
            
        }
        //else chosen nothing
    }
    const deleteExpense = async (expenseId:number)=>{
        try{
            await axiosInstance.delete(`/expenses/${expenseId}`, getAuthHeader(loggedinUser))
            getRecentExpenses({});
        }catch(err){
            console.log("cannt delete expense",err)
        }
        
    }

    const getDropDownText = ():string=>{
        let text = 'Choose option';
        console.log(expensePayload)
        if(expensePayload&& expensePayload.category_id){
            const chosenCategory:Category|undefined = categoryList?.content.find(item=> item.id=== expensePayload.category_id);
            if(chosenCategory)
                text = chosenCategory.name;
        }
        return text;
    }
    const createUpdateExpense = async ()=>{
        setShowExpenseCreateUpdateModal(false)
        if(editingExpenseId==0){
            //meanse creating
            const response = await axiosInstance.post(`/expenses`,expensePayload, getAuthHeader(loggedinUser))
            const expense = response.data
            const currentExpenseList = [...expenseList?.content]
            currentExpenseList.push(expense)
            setExpenseList({...expenseList, content:currentExpenseList})
            setExpensePayload({
                category_id:0,
                cost:0,
                notes:"",
                dateTime:""
            })

        }
        else{
            //updating
            const response = await axiosInstance.put(`/expenses/${editingExpenseId}`,expensePayload, getAuthHeader(loggedinUser))
            const expense = response.data
            let currentExpenseList = [...expenseList?.content]
            currentExpenseList = currentExpenseList.filter(item=>item.id!==editingExpenseId);
            currentExpenseList.push(expense)
            setExpenseList({...expenseList, content:currentExpenseList})
            setExpensePayload({
                category_id:0,
                cost:0,
                notes:"",
                dateTime:""
            })
        }
    }
    useEffect(()=>{
        getOverViewData();
        getRecentExpenses({});
        getAllCategories({});
    },[]);
    const getAllCategories = async ({
        page=1, size=null
    }:{page?:number, size?:number|null})=>{
        try{
            const pageFinalSize = size? size : pageSize
            const response = await axiosInstance.get(`/categories?page=${page}&&size=${pageFinalSize}`, getAuthHeader(loggedinUser))
            setcategoryList(response.data);
        }catch(err){
            console.log('could not fetch dashboard data, error=',err);
        }
    }

    const formatDate = (dateTime:string) => {
        return dateTime.split('T')[0];
    };
    return(
        <div>

        <Modal show={showExpenseCreateUpdateModal} 
            onHide={cancelCreateUpdateExpense.bind(null)}
            >
                <Modal.Header closeButton>
                <Modal.Title>Create a new Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    <div className="form-group">
                            <label htmlFor="cost" className="me-2">When did this cost happen?</label>
                            <input 
                            name='cost'
                            type="date"
                            className="form-control"
                            
                             onChange={(e)=>
                                setExpensePayload({...expensePayload, dateTime:e.target.value})
                              } 
                              value={formatDate(expensePayload.dateTime)}
                            />
                    </div>
                        <label  className="me-2">Category Name</label>
                        <Dropdown onSelect={selectCategory}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                {getDropDownText()}
                               
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {
                                    categoryList?.content.map((item:Category,idx:number)=>{
                                        return(
                                        <Dropdown.Item key={idx} eventKey={item.id}>{item.name}</Dropdown.Item>
                                        )
                                    })
                                }
                                
                                
                            </Dropdown.Menu>
                        </Dropdown>
                        <div className="form-group">
                            <label>How much did you spend</label>
                            <input className="form-control w-50" onChange={(event)=>{
                                setExpensePayload({...expensePayload,  cost:Number(event.target.value)})
                            }}
                            value={expensePayload.cost}
                            />
                        </div>

                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" 
                 onClick={()=>cancelCreateUpdateExpense()}
                >
                    Cancel
                </Button>
                <Button variant="primary" 
                onClick={()=>createUpdateExpense()}
                > save
                </Button>
                </Modal.Footer>
            </Modal>

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
                    <button 
                    className="btn btn-success align-self-end me-4"
                    onClick={()=> setShowExpenseCreateUpdateModal(true)}
                     >Add new expense </button>
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
                            <th scope="col">Action</th>
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
                                        <td>
                                        <div>
                                        <button className="rounded me-2" 
                                        style={{background:"none", border:"1px solid"}}
                                        onClick={()=>{
                                            setExpensePayload({
                                                cost:item.cost,
                                                notes:item.notes,
                                                dateTime:item.dateTime,
                                                category_id:item.category? item.category.id:0
                                                
                                            })
                                            setShowExpenseCreateUpdateModal(true)
                                            setEditingExpenseId(item.id)
                                        }}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>

                                        <button className="rounded" 
                                        style={{background:"none", border:"1px solid"}} 
                                        onClick={ ()=>{
                                            const response:boolean = window.confirm("do you want to delete this expense")
                                            if(response){
                                                deleteExpense(item.id)
                                            }
                                            
                                        }}
                                        >
                                            <i className="bi bi-trash3-fill p-0 m-0"></i>
                                        </button>
                                    </div>
                                        </td>
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