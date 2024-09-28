export const Dashboard = ()=>{
    return(
        <div className="row">
            <div className="card mt-1" style={{width:"98%"}}>
            
                <div className="card-body">
                    <h5 className="card-title">Monthly overview</h5>
                    <div className="row">
                        <div className="col card me-2" style={{background:"#D6EA76"}}>
                            Total income this month
                            <h3> $ 120,000</h3>
                        </div>
                        <div className="col card me-2" style={{background:"#F5E0AF"}}>
                        Total expense this month
                        <h3> $ 105,000</h3>
                        </div>
                        <div className="col card" style={{background:"#D3D1FE"}}>
                            Net Balance
                            <h3> $ 15,000</h3>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Top spending categories</h2>
            <div className="p-3">
                
                <div className="row" >
                    <div className="col-2 card me-2" style={{background:"#D6EA76"}}>
                        <h5>Electricity</h5>
                        <p>$ 100</p>
                    </div>
                    <div className="col-2 card me-2" style={{background:"#D6EA76"}}>
                        <h5>Electricity</h5>
                        <p>$ 100</p>
                    </div>
                    <div className="col-2 card me-2" style={{background:"#D6EA76"}}>
                        <h5>Electricity</h5>
                        <p>$ 100</p>
                    </div>
                    <div className="col-2 card me-2" style={{background:"#D6EA76"}}>
                        <h5>Electricity</h5>
                        <p>$ 100</p>
                    </div>
                    <div className="col-2 card me-2" style={{background:"#D6EA76"}}>
                        <h5>Electricity</h5>
                        <p>$ 100</p>
                    </div>
                </div>
            </div>
            <h2>Recent Expenses</h2>
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