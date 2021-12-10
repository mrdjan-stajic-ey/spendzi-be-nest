export interface AggregationExpenses {
  labels: string[];
  datasets: [
    {
      data: any[];
      [key: string]: any;
    },
  ];
}
