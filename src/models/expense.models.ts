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
    id:Number,
    category?: Category|null,
    cost:Number,
    dateTime:string,
    notes:string
}