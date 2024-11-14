import { Category } from "./expense.models";

export interface BudgetItem {
    id: number;
    category: Category;
    maxSpend: number;
    warningSpend: number;
}

export interface Budget {
    id: number;
    budget_period: string;
    estimatedIncome: number;
    maxSpend: number;
    warningSpend: number;
    budgetItemList: BudgetItem[];
}

export interface BudgetSummaryListItem {
    id: number;
    budget_period: string;
    maximum_expense: number;
    total_expense: number;
    total_income: number;
}

export interface CategoryWiseBudgetSummary {
    budget_item_id: number;
    max_spend: number;
    warning_spend: number;
    category_id: number;
    category_name: string;
    total_expense: number;
    unbudgeted:boolean;
}

export interface BudgetSummary {
    budget: Budget;
    total_spent: number;
    category_wise_budget_summary: CategoryWiseBudgetSummary[];
}

export interface BudgetItemPayload{
    category_id?:number,
    warningSpend?:number,
    maxSpend?:number,
}

export interface BudgetPayload{
    budget_period: string;
    estimatedIncome: number;
    maxSpend: number;
    warningSpend: number;
}

