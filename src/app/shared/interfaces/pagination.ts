export type DeletePageAction =
  | {
      type: 'update';
    }
  | {
      type: 'reload';
    }
  | {
      type: 'previous-page';
      pageIndex: number;
    };
