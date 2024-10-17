export interface IncomeByIncomeSource {
    income_source_name: string;
    income_total: number;
    income_month: number;
    income_source_id: number;
}

export interface IncomeSummary {
    totalIncomeThisMonth: number;
    totalIncomeLastMonth: number;
    budgetedIncomeThisMonth: number;
    incomeListBySource: IncomeByIncomeSource[];
}

export interface IncomeSource {
    id: number;
    name: string;
}

export interface Income {
    id: number;
    amount: number;
    notes: string;
    dateTime: string; // ISO 8601 date string
    incomeSource: IncomeSource;
}