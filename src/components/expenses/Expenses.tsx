import React, { useEffect, useState } from "react";
import ExpenseHttpResponse from "../../types/expense-http-response";
import HttpResponse from "../../types/http-response";
import Expense from "./Expense";
import "./Expenses.css";

const Expenses = () => {
  const [expenses, setExpenses] = useState<ExpenseHttpResponse[] | null>(null);

  useEffect(() => {
    const getExpenses = async () => {
      const response: HttpResponse<{
        expenses: ExpenseHttpResponse[] | null;
      }> = await fetch("http://localhost:8080/api/v1/expenses")
        .then((resp) => resp.json())
        .catch((err) => console.error(err));
      const { data } = response;
      setExpenses(data.expenses);
    };
    getExpenses();
  }, []);

  return (
    <React.Fragment>
      <h1>Expenses</h1>
      <div>
        <table id="expenses-grid">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses &&
              expenses.map((expense, index) => (
                <Expense expense={expense} index={index} key={expense.id} />
              ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default Expenses;
