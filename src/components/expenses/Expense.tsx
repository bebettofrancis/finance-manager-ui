import React from "react";
import ExpenseCategory from "../../types/expenses/ExpenseCategory";
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

  const getCategoriesDropdown = (
    selectedValue: number,
    categories: ExpenseCategory[] | null
  ) => {
    return (
      <select value={selectedValue} disabled={true}>
        {categories &&
          categories.map((element) => (
            <option key={element.id} value={element.id}>
              {element.name}
            </option>
          ))}
      </select>
    );
  };

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        {expensesMetadata &&
          getCategoriesDropdown(
            expenseProps.categoryId,
            expensesMetadata.categories
          )}
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
