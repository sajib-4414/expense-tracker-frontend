import { createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
// import GuardedHOC from "./components/common/GuardedComponent";

import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/common/ErrorFallback";
import { ExpenseHomeContainer } from "./pages/ExpenseHomeContainer";
import { Dashboard } from "./pages/Dashboard";
import { IncomeBoard } from "./pages/IncomeBoard";
import { ExpenseBoard } from "./pages/ExpenseBoard";
import { BudgetBoard } from "./pages/BudgetBoard";
import GuardedHOC from "./components/common/GuardedComponent";

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
const WrappedExpense = HOCWithContainer(ExpenseBoard)
const WrappedBudget = HOCWithContainer(BudgetBoard)
const WrappedIncome = HOCWithContainer(IncomeBoard)

const GuardedDashboard = GuardedHOC(WrappedDashboard)
const GuardedIncomeBoard = GuardedHOC(WrappedIncome)
const GuardedBudgetBoard = GuardedHOC(WrappedBudget)

export const router = createBrowserRouter([
    {
      element: <GuardedDashboard />,
      path: "",
      errorElement:<ErrorFallback/>
    },
    {
      element: <GuardedIncomeBoard />,
      path: "/income"
    },
    {
      element: <WrappedExpense />,
      path: "/expenses"
    },
    {
      element: <GuardedBudgetBoard />,
      path: "/budgets"
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