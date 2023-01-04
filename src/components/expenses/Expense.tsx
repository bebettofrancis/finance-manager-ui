import React from "react";
import ExpenseHttpResponse from "../../types/expense-http-response";

const Expense: React.FC<{
  expense: ExpenseHttpResponse;
  index: number;
}> = ({ expense, index }) => {
  const expenseDate = new Date(expense.date);
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{expense.categoryId}</td>
      <td>{expense.amount}</td>
      <td>{expenseDate.toString()}</td>
    </tr>
  );
};

export default Expense;
