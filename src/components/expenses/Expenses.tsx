import React, { useEffect, useState } from "react";
import ExpenseProps from "../../types/expenses/expense-props";
import ExpenseHttpResponse from "../../types/expenses/expense-http-response";
import HttpResponse from "../../types/http-response";
import Expense from "./Expense";
import "./Expenses.css";
import { cloneDeep, uniqueId } from "lodash";
import ExpenseMetadata from "../../types/expenses/expense-metadata";

const Expenses = () => {
  const [metadata, setMetadata] = useState<ExpenseMetadata | null>(null);
  const [expenses, setExpenses] = useState<ExpenseProps[] | null>(null);

  useEffect(() => {
    const getMetadata = async () => {
      const response: HttpResponse<ExpenseMetadata | null> = await fetch(
        "http://localhost:8080/api/v1/expenses/metadata"
      )
        .then((resp) => resp.json())
        .catch((err) => console.error(err));
      const { data } = response;
      if (data == null) {
        return;
      }
      setMetadata(data);
    };

    const getExpenses = async () => {
      const response: HttpResponse<{
        expenses: ExpenseHttpResponse[] | null;
      }> = await fetch("http://localhost:8080/api/v1/expenses")
        .then((resp) => resp.json())
        .catch((err) => console.error(err));
      const { data } = response;
      const expensesResponse = data.expenses;
      if (expensesResponse == null) {
        return;
      }
      setExpenses(
        expensesResponse.map(
          (expenseResponse) =>
            ({
              id: `expense-${expenseResponse.id}`,
              categoryId: expenseResponse.categoryId,
              comment: expenseResponse.comment,
              date: expenseResponse.date,
              amount: expenseResponse.amount,
            } as ExpenseProps)
        )
      );
    };

    const getData = async () => {
      await getMetadata();
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

  const removeExpense = (index: number) => {
    const clonedExpenses = cloneDeep(expenses);
    if (clonedExpenses == null) {
      return;
    }
    clonedExpenses.splice(index, 1);
    setExpenses(clonedExpenses);
  };

  const saveExpenses = (e: React.SyntheticEvent) => {
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
                    expense={expense}
                    index={index}
                    metadata={metadata}
                    removeExpenseHandler={removeExpense}
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
