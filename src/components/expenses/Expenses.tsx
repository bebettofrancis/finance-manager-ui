import { cloneDeep, uniqueId } from "lodash";
import React, { useEffect, useState } from "react";
import ExpenseProps from "../../types/expenses/ExpenseProps";
import ExpensesMetadata from "../../types/expenses/ExpensesMetadata";
import GetExpenses from "../../types/expenses/http/GetExpenses";
import GetExpensesMetadata from "../../types/expenses/http/GetExpensesMetadata";
import HttpResponse from "../../types/HttpResponse";
import { makeRequest } from "../../utils/HttpUtils";
import Expense from "./Expense";
import "./Expenses.css";

const Expenses = () => {
  const [expensesMetadata, setExpensesMetadata] =
    useState<ExpensesMetadata | null>(null);
  const [expenses, setExpenses] = useState<ExpenseProps[] | null>(null);

  const getExpensesMetadata = async () => {
    const response: HttpResponse<GetExpensesMetadata | null> =
      await makeRequest("http://localhost:8080/api/v1/expenses/metadata");
    const { data } = response;
    if (data === null) {
      return;
    }
    setExpensesMetadata(data);
  };

  const getExpenses = async () => {
    const response: HttpResponse<GetExpenses> = await makeRequest(
      "http://localhost:8080/api/v1/expenses"
    );
    const { data } = response;
    const expensesResponse = data.expenses;
    if (expensesResponse === null) {
      return;
    }
    setExpenses(
      expensesResponse.map(
        (expenseResponse) =>
          ({
            id: `expense-${expenseResponse.id}`,
            categoryId: expenseResponse["category-id"],
            comment: expenseResponse.comment,
            date: expenseResponse.date,
            amount: expenseResponse.amount,
          } as ExpenseProps)
      )
    );
  };

  useEffect(() => {
    const getData = async () => {
      await getExpensesMetadata();
      await getExpenses();
    };
    getData();
  }, []);

  const addExpense = () => {
    const newExpense: ExpenseProps = {
      id: uniqueId("new-expense-"),
      categoryId: 1,
      comment: "",
      date: "",
      amount: 0,
    };
    setExpenses((prev) =>
      prev === null ? [newExpense] : [...cloneDeep(prev), newExpense]
    );
  };

  const updateExpense = (index: number, expense: ExpenseProps) => {
    setExpenses((prev) => {
      if (prev === null || index >= prev.length) {
        return prev;
      }
      const clonedExpenses = cloneDeep(prev);
      clonedExpenses[index] = expense;
      return clonedExpenses;
    });
  };

  const removeExpense = (index: number) => {
    const clonedExpenses = cloneDeep(expenses);
    if (clonedExpenses == null) {
      return;
    }
    clonedExpenses.splice(index, 1);
    setExpenses(clonedExpenses);
  };

  const saveExpenses = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/v1/expenses", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  };

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
              {expenses &&
                expenses.map((expense, index) => (
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
