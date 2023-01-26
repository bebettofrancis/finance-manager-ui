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
  const id = expenseProps.id;
  let { amount, date, comment, categoryId } = expenseProps;

  const removeExpense = () => {
    removeExpenseHandler(index);
  };

  const updateExpense = () => {
    const expense = { id, amount, date, comment, categoryId } as ExpenseProps;
    updateExpenseHandler(index, expense);
  };

  const getCategoriesDropdown = (categories: ExpenseCategory[] | null) => {
    return (
      <select
        value={categoryId}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          categoryId = +e.target.value;
          updateExpense();
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
            amount = +e.target.value;
            updateExpense();
          }}
        />
      </td>
      <td>
        <input
          type="text"
          value={date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            date = e.target.value;
            updateExpense();
          }}
        />
      </td>
      <td>
        <input
          type="text"
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            comment = e.target.value;
            updateExpense();
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
