type ExpenseProps = {
  id: string;
  categoryId: number;
  comment: string;
  date: string;
  amount: number;
  isUpdated?: boolean;
};

export default ExpenseProps;
