import React from "react";
import ExpenseProps from "../../types/expenses/ExpenseProps";
import ExpensesMetadata from "../../types/expenses/ExpensesMetadata";

const Expense: React.FC<{
  expenseProps: ExpenseProps;
  index: number;
  expensesMetadata: ExpensesMetadata | null;
  removeExpenseHandler(index: number): void;
}> = ({ expenseProps, index, expensesMetadata, removeExpenseHandler }) => {
  const removeExpense = () => {
    removeExpenseHandler(index);
  };

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        {expensesMetadata && expensesMetadata[expenseProps.categoryId].name}
      </td>
      <td>{expenseProps.amount}</td>
      <td>{expenseProps.date}</td>
      <td>{expenseProps.comment}</td>
      <td>
        <button type="button" onClick={removeExpense}>
          x
        </button>
      </td>
    </tr>
  );
};

export default Expense;
