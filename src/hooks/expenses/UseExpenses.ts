import { cloneDeep, uniqueId } from "lodash";
import { useCallback, useEffect, useState } from "react";
import ExpenseProps from "../../types/expenses/ExpenseProps";
import ExpensesMetadata from "../../types/expenses/ExpensesMetadata";
import GetExpenses from "../../types/expenses/http/GetExpenses";
import GetExpensesMetadata from "../../types/expenses/http/GetExpensesMetadata";
import HttpResponse from "../../types/HttpResponse";
import useHttp from "../http/UseHttp";

const useExpenses = () => {
  const [expensesMetadata, setExpensesMetadata] =
    useState<ExpensesMetadata | null>(null);
  const [expenses, setExpenses] = useState<{
    allExpenses: ExpenseProps[] | null;
    removedExpenses: ExpenseProps[] | null;
  }>({
    allExpenses: null,
    removedExpenses: null,
  });

  const { sendHttp: getExpensesMetadataHttp } = useHttp();
  const { sendHttp: getExpensesHttp } = useHttp();

  const getExpensesMetadata = useCallback(async () => {
    const response: HttpResponse<GetExpensesMetadata> | undefined =
      await getExpensesMetadataHttp(
        "http://localhost:8080/api/v1/expenses/metadata"
      );
    if (!(response && response.data)) {
      return;
    }
    setExpensesMetadata(response.data);
  }, [getExpensesMetadataHttp]);

  const getExpenses = useCallback(async () => {
    const response: HttpResponse<GetExpenses> | undefined =
      await getExpensesHttp("http://localhost:8080/api/v1/expenses");
    if (!(response && response.data && response.data.expenses)) {
      return;
    }
    setExpenses({
      allExpenses: response.data.expenses.map(
        (expense) =>
          ({
            id: `expense-${expense.id}`,
            categoryId: expense["category-id"],
            comment: expense.comment,
            date: expense.date,
            amount: expense.amount,
          } as ExpenseProps)
      ),
      removedExpenses: null,
    });
  }, [getExpensesHttp]);

  useEffect(() => {
    const getData = async () => {
      await getExpensesMetadata();
      await getExpenses();
    };
    getData();
  }, [getExpensesMetadata, getExpenses]);

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
        clonedExpenses.allExpenses.length === 0 ||
        index >= clonedExpenses.allExpenses.length
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

  return {
    expensesMetadata,
    expenses,
    addExpense,
    saveExpenses,
    removeExpense,
    updateExpense,
  };
};

export default useExpenses;
