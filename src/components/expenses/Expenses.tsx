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
  const [removedExpenses, setRemovedExpenses] = useState<ExpenseProps[] | null>(
    null
  );

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
    setExpenses((prev) => {
      if (prev === null) {
        return [newExpense];
      }
      const clonedExpenses = cloneDeep(prev);
      clonedExpenses.push(newExpense);
      return clonedExpenses;
    });
  };

  const updateExpense = (index: number, expense: ExpenseProps) => {
    setExpenses((prev) => {
      if (prev === null || prev.length === 0 || index >= prev.length) {
        return prev;
      }
      const clonedExpenses = cloneDeep(prev);
      if (expense.id.split("-")[0] !== "new") {
        expense.isUpdated = true;
      }
      clonedExpenses[index] = expense;
      return clonedExpenses;
    });
  };

  const removeExpense = (index: number) => {
    setRemovedExpenses((prev) => {
      if (expenses === null || expenses.length === 0) {
        return prev;
      }
      const clonedRemovedExpense = cloneDeep(expenses[index]);
      return prev === null
        ? [clonedRemovedExpense]
        : [...cloneDeep(prev), clonedRemovedExpense];
    });
    setExpenses((prev) => {
      if (prev === null || prev.length === 0) {
        return prev;
      }
      const clonedExpenses = cloneDeep(prev);
      clonedExpenses.splice(index, 1);
      return clonedExpenses;
    });
  };

  const saveExpenses = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestBody = { update: [], insert: [] } as any;
    if (removedExpenses) {
      requestBody["delete"] = removedExpenses.map(
        ({ id, categoryId, comment, date, amount }) => {
          return {
            id: +id.split("expense-")[1],
            "category-id": categoryId,
            comment,
            date,
            amount,
          };
        }
      );
    }
    if (expenses) {
      expenses.forEach(
        ({ id, isUpdated, categoryId, comment, date, amount }) => {
          if (isUpdated) {
            requestBody["update"].push({
              id: +id.split("expense-")[1],
              "category-id": categoryId,
              comment,
              date,
              amount,
            });
          } else if (id.split("-")[0] === "new") {
            requestBody["insert"].push({
              id: 0,
              "category-id": categoryId,
              comment,
              date,
              amount,
            });
          }
        }
      );
    }
    console.debug(requestBody);
    fetch("http://localhost:8080/api/v1/expenses", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
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
