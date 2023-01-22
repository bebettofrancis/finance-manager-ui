import React from "react";
import ExpenseMetadata from "../../types/expenses/expense-metadata";
import ExpenseProps from "../../types/expenses/expense-props";

const Expense: React.FC<{
  expense: ExpenseProps;
  index: number;
  metadata: ExpenseMetadata | null;
  removeExpenseHandler(index: number): void;
}> = ({ expense, index, metadata, removeExpenseHandler }) => {
  const removeExpense = () => {
    removeExpenseHandler(index);
  };

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        {
          metadata?.categories.find(
            (element) => element.id === expense.categoryId
          )?.name
        }
      </td>
      <td>{expense.amount}</td>
      <td>{expense.date}</td>
      <td>{expense.comment}</td>
      <td>
        <button type="button" onClick={removeExpense}>
          x
        </button>
      </td>
    </tr>
  );
};

export default Expense;
