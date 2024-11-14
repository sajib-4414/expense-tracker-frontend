import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { LoggedInUser } from "../models/user.models";
import { useAppSelector } from "../store/store";
import { useEffect, useState } from "react";
import { Budget,  BudgetItemPayload, BudgetPayload, BudgetSummary, BudgetSummaryListItem, CategoryWiseBudgetSummary } from "../models/budget.models";
import { PaginatedResponse } from "../models/common.models";
import { axiosInstance } from "../utility/axiosInstance";
import { getAuthHeader } from "../utility/authHelper";
import { PageSection } from "../components/common/PageSection";
import { formatDate } from "../utility/datehelper";
import { Category } from "../models/expense.models";



export const BudgetBoard = ()=>{
    const loggedinUser:LoggedInUser|null = useAppSelector(
        (state)=> state.userSlice.loggedInUser //we can also listen to entire slice instead of loggedInUser of the userSlice
    )
    const [budgetSummary, setBudgetSummary] = useState<BudgetSummary|null>(null);
    const [budgetList, setBudgetList] = useState<PaginatedResponse<BudgetSummaryListItem>|null>(null);
    const [pageSize, setPageSize] = useState<number>(5);
    const [showBudgetItemModal,setShowBudgetItemModal] = useState(false)
    const [showNewBudgetModal, setshowNewBudgetModal] = useState(false);
    const [categoryList, setcategoryList] = useState<PaginatedResponse<Category>|null>(null);
    const [budgetItemPayload, setBudgetItemPayload] = useState<BudgetItemPayload|null>(null);
    const [budgetPayload, setBudgetPayload] = useState<BudgetPayload>({
        budget_period: '',
        estimatedIncome: 0,
        maxSpend: 0,
        warningSpend: 0
    });
    const [editingBudgetId, setEditingBudgetId] = useState<number>(0);
    const [budgetFormError, setBudgetFormError] = useState<string|null>(null);
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

    const getOverViewData = async ()=>{
        try{
            const response = await axiosInstance.get('/budgets/summary', getAuthHeader(loggedinUser))
            setBudgetSummary(response.data);
        }catch(err){
            console.log('could not fetch dashboard data, error=',err);
        }
    }
    const getAllBudgets = async ({
        page=1, size=null
    }:{page?:number, size?:number|null})=>{
        try{
            const pageFinalSize = size? size : pageSize
            const response = await axiosInstance.get(`/budgets?page=${page}&&size=${pageFinalSize}`, getAuthHeader(loggedinUser))
            setBudgetList(response.data);
        }catch(err){
            console.log('could not fetch dashboard data, error=',err);
        }
    }
    const onPageChange = async(pageNumber:number)=>{
        getAllBudgets({page:pageNumber})
    }
    const handlePageSizeChange = (event:React.ChangeEvent<HTMLSelectElement> ) =>{
        console.log('i am being invoked', event.target.value)
        const selectedValue = event.target.value;
        const sizeHere = (parseInt(selectedValue)||1)
        setPageSize(sizeHere);
        getAllBudgets({
          
            size:sizeHere
        });
    }
    useEffect(()=>{
        getOverViewData();
        getAllBudgets({});
        getAllCategories({});
    },[]);


    const getCurrentMonth = ()=>{
        const currentMonthNumber = new Date().getMonth() + 1;
        console.log("Current month (number):", currentMonthNumber);

        // Get the current month as a full name
        const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });
        console.log("Current month (name):", currentMonthName);
        return currentMonthName
    }
    const selectCategory = (option:string|null)=>{
        if(option !=null){
            const categoryChosen:Category|undefined = categoryList?.content.find(item=>item.id===Number(option));
            if(categoryChosen){
                console.log("chosen=",categoryList?.content.find(item=>item.id===Number(option)));
                if (!budgetItemPayload){
                    setBudgetItemPayload({
                        category_id:Number(option)
                    })
                }
                else{
                    setBudgetItemPayload({...budgetItemPayload,category_id:Number(option)})
                }
            }
            
        }
        //else chosen nothing
    }
    const cancelCreatingBudgetItem = ()=>{
        setShowBudgetItemModal(false);
        setBudgetItemPayload(null);
    }
    const handlenewBudgetModalCancel = ()=>{
        setshowNewBudgetModal(false);

    }
    const getDropDownText = ():string=>{
        let text = 'Choose option';
        if(budgetItemPayload&& budgetItemPayload.category_id){
            const chosenCategory:Category|undefined = categoryList?.content.find(item=> item.id=== budgetItemPayload.category_id);
            if(chosenCategory)
                text = chosenCategory.name;
        }
        return text;
    }
    const createBudgetCategoryItem = async ()=>{
        setShowBudgetItemModal(false);
        try{
            await axiosInstance.post(`/budgets/${budgetSummary?.budget.id}/items`, 
                budgetItemPayload
                , getAuthHeader(loggedinUser), )
            getOverViewData();//refresh as we will get a new budget item
        }
        catch(err){
            console.log('could not create budget item',err)
        }
        
    }
    const createNewBudget = async ()=>{
        

        //check all the values
        if(!budgetPayload || Object.keys(budgetPayload).length==0){
            setBudgetFormError('please finish the form');
            return
        }
        else if(!budgetPayload.budget_period){
            setBudgetFormError('please finish the startDate');
            return
        }
        else if(!budgetPayload.estimatedIncome){
            setBudgetFormError('please finish the estimatedIncome');
            return

        }else if(!budgetPayload.maxSpend){
            setBudgetFormError('please finish the maxSpend');
            return

        }else if(!budgetPayload.warningSpend){
            setBudgetFormError('please finish the warningSpend');
            return
        }
        setshowNewBudgetModal(false);
        setBudgetFormError(null);
 


        try{
            await axiosInstance.post(`/budgets`, 
                budgetPayload
                , getAuthHeader(loggedinUser), )
            
        }
        catch(err){
            console.log('could not create budget ',err)
        }
    }
    const deleteBudgetItem = async (id:number)=>{
        try{
            await axiosInstance.delete(`/budgets/budget-items/${id}`, 
                
                getAuthHeader(loggedinUser) )
            getOverViewData();//refresh as we will get a new budget item
        }
        catch(err){
            console.log('could not delete budget item',err)
        }
    }
        
    return(
        <div>
            <Modal show={showBudgetItemModal} 
            onHide={()=> setShowBudgetItemModal(false)}
            >
                <Modal.Header closeButton>
                <Modal.Title>Create a new Itemized budget for this month</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                            <label>Maximum Budget</label>
                            <input className="form-control w-50" onChange={(event)=>{
                                if(budgetItemPayload)
                                    setBudgetItemPayload({...budgetItemPayload, maxSpend:Number(event.target.value)})
                                else
                                    setBudgetItemPayload({ maxSpend:Number(event.target.value)})
                            }}
                            value={budgetItemPayload?.maxSpend}
                            />
                        </div>

                        <div className="form-group">
                            <label>Warning Budget</label>
                            <input className="form-control w-50" onChange={(event)=>{
                                if(budgetItemPayload)
                                    setBudgetItemPayload({...budgetItemPayload, warningSpend:Number(event.target.value)})
                                else
                                    setBudgetItemPayload({ warningSpend:Number(event.target.value)})
                            }}
                            value={budgetItemPayload?.warningSpend}
                            />
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" 
                 onClick={()=>cancelCreatingBudgetItem()}
                >
                    Cancel
                </Button>
                <Button variant="primary" 
                onClick={()=>createBudgetCategoryItem()}
                > save
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showNewBudgetModal} onHide={handlenewBudgetModalCancel}>
                <Modal.Header closeButton>
                <Modal.Title>Create a New Budget</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-group">
                            <label htmlFor="month" className="me-2">Choose Month</label>
                            <input 
                            name='month'
                            type="date"
                            className="form-control"
                            
                             onChange={(e)=>
                                setBudgetPayload({...budgetPayload, budget_period:e.target.value})
                              } 
                              value={budgetPayload.budget_period}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="estimatedIncome" className="me-2">Estimated Income</label>
                            <input 
                            name='estimatedIncome'
                            type="number"
                            className="form-control"
                             onChange={(e)=>setBudgetPayload({...budgetPayload, estimatedIncome:Number(e.target.value)})} value={budgetPayload.estimatedIncome}
                            />
                        </div>
                        

                        <div className="form-group">
                            <label htmlFor="maxSpend" className="me-2">Maximum Spend:</label>
                            <input 
                            name='maxSpend'
                            type="number"
                            className="form-control"
                            onChange={(e)=>setBudgetPayload({...budgetPayload, maxSpend:Number(e.target.value)})} value={budgetPayload.maxSpend}
                            />
                        </div>
                       
                        <div className="form-group">
                            <label htmlFor="warningSpend" className="me-2">Warning Spend</label>
                            <input 
                            name='warningSpend'
                            type="number"
                            className="form-control"
                            onChange={(e)=>setBudgetPayload({...budgetPayload, warningSpend:Number(e.target.value)})} value={budgetPayload.warningSpend}
                            />
                        </div>
                        <p className="text-danger">{budgetFormError}</p>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handlenewBudgetModalCancel}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={createNewBudget}>
                    {editingBudgetId===0?'Create':'Update'} budget
                </Button>
                </Modal.Footer>
            </Modal>

            <div className="card mt-2 p-1" style={{background:"#D6EA76", width: "90%"}}>
                <h2>Budget for 2024 {getCurrentMonth()} </h2>
                <p>Budgeted max expenditure for the period <strong>{budgetSummary?.budget.maxSpend} $ </strong></p>
                <p>Budget spent <strong> {budgetSummary && (budgetSummary?.total_spent*100/budgetSummary?.budget.maxSpend).toFixed(2)}% </strong></p>
                <p>Budget defined in <strong>{budgetSummary?.budget.budgetItemList.length} </strong> categories</p>
                
                
            </div>
            <div>
            <div className="d-flex flex-column pe-4" >
                    <h3 className="d-inline p-0 m-0"> My itemized budget breakdown</h3>
                    <button
                     className="btn btn-success align-self-end me-4"
                     onClick={()=>{
                        console.log('clicked')
                        setShowBudgetItemModal(true)
                    }}
                      >Add new itemized budget</button>
                </div>
                
                <div className="p-3">
                
                    <div className="row" >
                        {budgetSummary && budgetSummary.category_wise_budget_summary.map((item:CategoryWiseBudgetSummary,idx)=>{
                            return (
                                <div key={idx} className="col-2 card me-2" style={{background:"#D6EA76"}}>
                                    <h5>{ item.category_id!==0? item.category_name: 'Uncategorized'} 
                                        {item.unbudgeted ? '(Unbudgeted)':''}
                                    </h5>
                                    {item.unbudgeted == false &&
                                        <p style={{textAlign:"right"}}>
                                        <button className="rounded" 
                                            style={{background:"none", border:"1px solid", width:"30px"}} 
                                            onClick={ ()=>{
                                                let userResponse = confirm("Do you want to delete Budget for this category?");
                                                if (userResponse) {
                                                    console.log("User clicked OK");
                                                    deleteBudgetItem(item.budget_item_id);
                                                } else {
                                                    console.log("User clicked Cancel");
                                                }
                                            }}
                                            >
                                                <i className="bi bi-trash3-fill p-0 m-0"></i>
                                        </button>
                                    </p>
                                    }
                                    
                                    
                                    <p className="p-0 m-0"> Spent: ${item.total_expense}</p>
                                    {item.category_id!==0 && 
                                    <>
                                        <p className="p-0 m-0"> Maximum Budget: ${item.max_spend}</p>
                                        <p> $ Remaining: {Math.max(0,(1-(item.total_expense/item.max_spend))*100).toFixed(2)}%</p>
                                    </>
                                    }
                                     
                                    
                                </div>
                            )
                        })}
                        
                        
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column pe-4" >
                    <h3 className="d-inline p-0 m-0"> All budgets</h3>
                    <button className="btn btn-success align-self-end me-4" 
                    onClick={()=>setshowNewBudgetModal(true)}
                    >
                        Add new budget 
                    </button>
            </div>
            {(!budgetList || budgetList.content.length===0) && 
            <p>
                No budgets defined.
            </p>
            }
             {(budgetList && budgetList.content.length>0) &&
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
                            <th scope="col">Month</th>
                            <th scope="col">Maximum Expense</th>
                            <th scope="col">Total Income</th>
                            <th scope="col">Spent</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {budgetList.content.map((item:BudgetSummaryListItem,idx)=>{
                                return(
                                    <tr key={idx}>
                                        <th scope="row">{idx+1}</th>
                                        <td>{formatDate(item.budget_period)}</td>
                                        <td>{item.maximum_expense}</td>
                                        <td>{item.total_income}</td>
                                        <td>{item.total_expense}</td>
                                        
                                    </tr>
                                )
                            })}
                            
                            
                           
                        </tbody>
                    </table>
                    <PageSection
                            pagedList={budgetList}
                            onPageChange={onPageChange}
                    />

                </>}
        </div>
    )
}