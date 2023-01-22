type HttpResponse<T> = {
  status: number;
  message: string;
  data: T;
  timeStamp: string;
  errors: string[];
};

export default HttpResponse;
