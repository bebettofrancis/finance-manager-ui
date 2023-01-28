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
  const [expenses, setExpenses] = useState<{
    allExpenses: ExpenseProps[] | null;
    removedExpenses: ExpenseProps[] | null;
  }>({
    allExpenses: null,
    removedExpenses: null,
  });

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
    setExpenses({
      allExpenses: expensesResponse.map(
        (expenseResponse) =>
          ({
            id: `expense-${expenseResponse.id}`,
            categoryId: expenseResponse["category-id"],
            comment: expenseResponse.comment,
            date: expenseResponse.date,
            amount: expenseResponse.amount,
          } as ExpenseProps)
      ),
      removedExpenses: null,
    });
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
    setExpenses((prevExpenses) => {
      const clonedExpenses = cloneDeep(prevExpenses);
      if (clonedExpenses.allExpenses === null) {
        clonedExpenses.allExpenses = [newExpense];
        return clonedExpenses;
      }
      clonedExpenses.allExpenses.push(newExpense);
      return clonedExpenses;
    });
  };

  const updateExpense = (index: number, expense: ExpenseProps) => {
    setExpenses((prevExpenses) => {
      const clonedExpenses = cloneDeep(prevExpenses);
      if (
        clonedExpenses.allExpenses === null ||
        clonedExpenses.allExpenses.length === 0 ||
        index >= clonedExpenses.allExpenses.length
      ) {
        return prevExpenses;
      }
      if (expense.id.split("-")[0] !== "new") {
        expense.isUpdated = true;
      }
      clonedExpenses.allExpenses[index] = expense;
      return clonedExpenses;
    });
  };

  const removeExpense = (index: number) => {
    setExpenses((prevExpenses) => {
      const clonedExpenses = cloneDeep(prevExpenses);
      if (
        clonedExpenses.allExpenses === null ||
        clonedExpenses.allExpenses.length === 0
      ) {
        return prevExpenses;
      }
      const toBeRemovedExpense = cloneDeep(clonedExpenses.allExpenses[index]);
      clonedExpenses.allExpenses.splice(index, 1);
      if (prevExpenses.removedExpenses === null) {
        prevExpenses.removedExpenses = [toBeRemovedExpense];
        return clonedExpenses;
      }
      prevExpenses.removedExpenses.push(toBeRemovedExpense);
      return clonedExpenses;
    });
  };

  const saveExpenses = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.debug(expenses);
    const requestBody = { update: [], insert: [] } as any;
    if (expenses.removedExpenses) {
      requestBody["delete"] = expenses.removedExpenses.map(
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
    if (expenses.allExpenses) {
      expenses.allExpenses.forEach(
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
    fetch("http://localhost:8080/api/v1/expenses", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }).then(() => {
      getExpenses();
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
