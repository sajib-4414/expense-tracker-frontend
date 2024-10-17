import { Form } from "react-bootstrap";

export const BudgetBoard = ()=>{

    const getCurrentMonth = ()=>{
        const currentMonthNumber = new Date().getMonth() + 1;
        console.log("Current month (number):", currentMonthNumber);

        // Get the current month as a full name
        const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });
        console.log("Current month (name):", currentMonthName);
        return currentMonthName
    }
    return(
        <div>
            <div className="card mt-2 p-1" style={{background:"#D6EA76", width: "90%"}}>
                <h2>Budget for 2024 {getCurrentMonth()} </h2>
                <p>Budgeted max expenditure for the period <strong>15,000$ </strong></p>
                <p>Budget spent <strong>70% </strong></p>
                <p>Budget defined in <strong>5 </strong> categories</p>
                
                
            </div>
            <div>
            <div className="d-flex flex-column pe-4" >
                    <h3 className="d-inline p-0 m-0"> My itemized budget breakdown</h3>
                    <button className="btn btn-success align-self-end me-4" >Add new itemized budget</button>
                </div>
                
                <div className="p-3">
                
                    <div className="row" >
                        <div className="col-2 card me-2" style={{background:"#D6EA76"}}>
                            <h5>Salary</h5>
                            <p className="p-0 m-0">Spent: $ 100</p>
                            <p className="p-0 m-0 mb-1">Spend status: 60%</p>
                        </div>
                        <div className="col-2 card me-2" style={{background:"#D6EA76"}}>
                            <h5>Gift</h5>
                            <p className="p-0 m-0">Spent: $ 100</p>
                            <p className="p-0 m-0 mb-1">Spend status: 60%</p>
                        </div>
                        <div className="col-2 card me-2" style={{background:"#D6EA76"}}>
                            <h5>Tax refund</h5>
                            <p className="p-0 m-0">Spent: $ 100</p>
                            <p className="p-0 m-0 mb-1">Spend status: 60%</p>
                        </div>
                        <div className="col-3 card me-2" style={{background:"#D6EA76"}}>
                            <h5>Uncategorized</h5>
                            <p className="p-0 m-0">Spent: $ 100</p>
                            <p className="p-0 m-0 mb-1">Spend status: 60%</p>
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column pe-4" >
                    <h3 className="d-inline p-0 m-0"> Previously defined budgets</h3>
                    <button className="btn btn-success align-self-end me-4" >Add budget for future </button>
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
                    <th scope="col">Budget Month</th>
                    <th scope="col">Max expense defined</th>
                    <th scope="col">Spent</th>
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