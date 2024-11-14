export interface CategoryExpense {
    category_id: number;
    category_name: string;
    category_cost: number;
}

export interface FinancialSummary {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    topCategoryExpense: CategoryExpense[];
}

export interface ExpenseBoardSummary {
    totalExpenseThisMonth: number;
    totalExpenseLastMonth: number;
    budgetedExpenseThisMonth: number;
    categoryWiseExpense: CategoryExpense[];
}

export interface Category{
    id:number,
    name:string
    custom?:boolean
}

export interface Expense{
    id:number,
    category?: Category|null,
    cost:number,
    dateTime:string,
    notes:string
}
export interface ExpensePayload{
    cost: number;
    notes: string;
    dateTime:string;
    category_id?:number;
}