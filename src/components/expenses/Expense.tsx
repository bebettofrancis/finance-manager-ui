import { cloneDeep } from "lodash";
import React from "react";
import ExpenseCategory from "../../types/expenses/ExpenseCategory";
import ExpenseProps from "../../types/expenses/ExpenseProps";
import ExpensesMetadata from "../../types/expenses/ExpensesMetadata";

const Expense: React.FC<{
  expenseProps: ExpenseProps;
  index: number;
  expensesMetadata: ExpensesMetadata | null;
  removeExpenseHandler(index: number): void;
  updateExpenseHandler(index: number, expense: ExpenseProps): void;
}> = ({
  expenseProps,
  index,
  expensesMetadata,
  removeExpenseHandler,
  updateExpenseHandler,
}) => {
  const { categoryId, amount, date, comment } = expenseProps;
  const removeExpense = () => {
    removeExpenseHandler(index);
  };

  const getCategoriesDropdown = (categories: ExpenseCategory[] | null) => {
    return (
      <select
        value={categoryId}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const expense = cloneDeep(expenseProps);
          expense.categoryId = +e.target.value;
          updateExpenseHandler(index, expense);
        }}
      >
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
        {expensesMetadata && getCategoriesDropdown(expensesMetadata.categories)}
      </td>
      <td>
        <input
          type="number"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const expense = cloneDeep(expenseProps);
            expense.amount = +e.target.value;
            updateExpenseHandler(index, expense);
          }}
        />
      </td>
      <td>
        <input
          type="date"
          value={date.split(" ")[0]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const expense = cloneDeep(expenseProps);
            expense.date = e.target.value;
            updateExpenseHandler(index, expense);
          }}
        />
      </td>
      <td>
        <textarea
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const expense = cloneDeep(expenseProps);
            expense.comment = e.target.value;
            updateExpenseHandler(index, expense);
          }}
        />
      </td>
      <td>
        <button type="button" onClick={removeExpense}>
          x
        </button>
      </td>
    </tr>
  );
};

export default Expense;
