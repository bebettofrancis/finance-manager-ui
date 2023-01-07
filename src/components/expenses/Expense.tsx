import React from "react";
import ExpenseProps from "../../types/expense-props";

const Expense: React.FC<{
  expense: ExpenseProps;
  index: number;
  removeExpenseHandler(index: number): void;
}> = ({ expense, index, removeExpenseHandler }) => {
  const removeExpense = () => {
    removeExpenseHandler(index);
  };

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{expense.categoryId}</td>
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
