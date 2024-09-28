import { Sidebar } from '../components/sidebar';
import './expensehome.css';

interface ExpenseHomeProps {
  children: React.ReactNode; // Define children as ReactNode
}

export const ExpenseHomeContainer:React.FC <ExpenseHomeProps>= ({children}) => {


  return (
    <div className="container-fluid p-0 ">
      <div className="row ">
        <div className="col-md-3 vh-100 ">
          <Sidebar/>
        </div>
        <div className="col-md-9">
          {children}

        </div>
      </div>
    </div>
    
  );
};
