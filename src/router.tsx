import { createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
// import GuardedHOC from "./components/common/GuardedComponent";

import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/common/ErrorFallback";
import { ExpenseHomeContainer } from "./pages/ExpenseHomeContainer";
import { Dashboard } from "./pages/Dashboard";
import { IncomeBoard } from "./pages/IncomeBoard";

const HOCWithContainer = (OriginalComponent:any) => {
  function NewComponent(props:any) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ExpenseHomeContainer>
        <OriginalComponent {...props} />
      </ExpenseHomeContainer>
       </ErrorBoundary>
    );
  }
  return NewComponent;
};

const WrappedDashboard = HOCWithContainer(Dashboard)
const WrappedIncome = HOCWithContainer(IncomeBoard)

// const GuardedExpenseHome = GuardedHOC(ExpenseHome)

export const router = createBrowserRouter([
    {
      element: <WrappedDashboard />,
      path: ""
    },
    {
      element: <WrappedIncome />,
      path: "/income"
    },
    {
        path: "/register",
        element: <Register/>
      },
      {
        path: "/login",
        element: <Login/>,
      },
     
 ])