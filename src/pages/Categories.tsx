import { LoggedInUser } from "../models/user.models";
import { useAppSelector } from "../store/store";
import { useEffect, useState } from "react";
import { PaginatedResponse } from "../models/common.models";
import { axiosInstance } from "../utility/axiosInstance";
import { getAuthHeader } from "../utility/authHelper";
import { Category } from "../models/expense.models";
import { Button, Form, Modal } from "react-bootstrap";
import { AxiosResponse } from "axios";



export const Categories = ()=>{
    const loggedinUser:LoggedInUser|null = useAppSelector(
        (state)=> state.userSlice.loggedInUser //we can also listen to entire slice instead of loggedInUser of the userSlice
    )
    const [categoryList, setcategoryList] = useState<PaginatedResponse<Category>|null>(null);
    const [pageSize, setPageSize] = useState<number>(5);

    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);


    const handleClose = () => {
        setShow(false);
        setEditingCategoryId(-1);
        setNewCategoryName("")
    }
        
    const handleDeleteClose = ()=> setShowDelete(false);
    const handleShow = () => setShow(true);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(-1);
    const [deletingCategoryId, setDeletingCategoryId] = useState(0);
    
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
    const onPageChange = async(pageNumber:number)=>{
        getAllCategories({page:pageNumber})
    }
    const handlePageSizeChange = (event:React.ChangeEvent<HTMLSelectElement> ) =>{
        console.log('i am being invoked', event.target.value)
        const selectedValue = event.target.value;
        const sizeHere = (parseInt(selectedValue)||1)
        setPageSize(sizeHere);
        getAllCategories({
          
            size:sizeHere
        });
    }
    const deleteCategory = async ()=>{
        setShowDelete(false);
        try{
            await axiosInstance.delete(`/categories/${deletingCategoryId}`, getAuthHeader(loggedinUser), )
            if(categoryList){
                const updatedCategories = structuredClone(categoryList.content).filter(item=> item.id !== deletingCategoryId)
                setcategoryList({...categoryList, content:updatedCategories})
            }
            
            


        }catch(err){
            console.log('delete failed', err)
        }
        finally{
            setDeletingCategoryId(0)
        }
    }
    const createCategory = async ()=>{
        handleClose();
        if(editingCategoryId ===-1){
            const response:AxiosResponse = await axiosInstance.post(`/categories`, {
                name:newCategoryName
            }, getAuthHeader(loggedinUser), )
            const newCategory:Category = response.data;
            const oldCategoryList:Category[] = categoryList ? structuredClone(categoryList.content) : [];
            oldCategoryList?.push(newCategory);
            if(categoryList){
                const newPage = structuredClone(categoryList);
                newPage.content = oldCategoryList
                setcategoryList(newPage)
            }
        }
        else{
            const response:AxiosResponse = await axiosInstance.put(`/categories/${editingCategoryId}`, {
                name:newCategoryName
            }, getAuthHeader(loggedinUser), )
            const newCategory:Category = response.data;
            let updatedCategoryList:Category[] = categoryList ? structuredClone(categoryList.content) : [];
            updatedCategoryList = updatedCategoryList.filter(item=> item.id !== editingCategoryId)
            updatedCategoryList.push(newCategory)
            if(categoryList){
                const newPage = structuredClone(categoryList);
                newPage.content = updatedCategoryList
                setcategoryList(newPage)
            }
        }
        
        setNewCategoryName("");
        setEditingCategoryId(-1);
        

    }
    useEffect(()=>{
        
        getAllCategories({});
    },[]);


    
    return(
        <div>
            <div className="card my-2 p-1" style={{background:"#D6EA76", width: "90%"}}>
                <h2> My Custom Expense and Budget Categories</h2>
                <p>Total <strong>{categoryList?.content.length}</strong> custom categories defined</p>
                
                
            </div>
            <div>
            <button className="btn btn-success align-self-end my-2" onClick={handleShow}>Add new category</button>
            
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <label htmlFor="categoryName" className="me-2">Category Name</label>
                        <input 
                        name='categoryName'
                         onChange={(e)=>setNewCategoryName(e.target.value)} value={newCategoryName}/>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={createCategory}>
                    {editingCategoryId===-1?'Create':'Update'} category
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDelete} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Category?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   Do you want to delete this category
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleDeleteClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={deleteCategory}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>
                
                <div className="p-1">
                
                   
                        {categoryList && categoryList.content.map((item:Category,idx)=>{
                            return (
                                <div key={idx} className=" card p-2 mb-2" style={{background:"#D6EA76", width:"80%"}}>
                                    <div className="d-flex justify-content-between">
                                    <h5>{  item.name}</h5>
                                    <div>
                                        <button className="rounded me-2" 
                                        style={{background:"none", border:"1px solid"}}
                                        onClick={()=>{
                                            setNewCategoryName(item.name)
                                            setShow(true)
                                            setEditingCategoryId(item.id)
                                        }}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>

                                        <button className="rounded" 
                                        style={{background:"none", border:"1px solid"}} 
                                        onClick={ ()=>{
                                            setDeletingCategoryId(item.id)
                                            setShowDelete(true)
                                        }}
                                        >
                                            <i className="bi bi-trash3-fill p-0 m-0"></i>
                                        </button>
                                    </div>
                                    
                                    
                                    </div>
                                    
                                    
                                    
                                </div>
                            )
                        })}
                        
                        
                  
                </div>
            </div>

            
             
        </div>
    )
}