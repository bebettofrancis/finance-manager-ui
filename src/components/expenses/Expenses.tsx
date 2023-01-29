import React from "react";
import useExpenses from "../../hooks/expenses/UseExpenses";
import Expense from "./Expense";
import "./Expenses.css";

const Expenses = () => {
  const {
    expensesMetadata,
    expenses,
    addExpense,
    saveExpenses,
    removeExpense,
    updateExpense,
  } = useExpenses();

  return (
    <React.Fragment>
      <h1>Expenses</h1>
      <div>
        <form onSubmit={saveExpenses}>
          <table className="expenses-grid">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Comment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.allExpenses &&
                expenses.allExpenses.map((expense, index) => (
                  <Expense
                    expenseProps={expense}
                    index={index}
                    expensesMetadata={expensesMetadata}
                    removeExpenseHandler={removeExpense}
                    updateExpenseHandler={updateExpense}
                    key={expense.id}
                  />
                ))}
            </tbody>
          </table>
          <div className="add-expense-section">
            <button type="button" onClick={addExpense}>
              +
            </button>
          </div>
          <div className="save-expenses-section">
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Expenses;
