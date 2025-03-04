type Theme = {
  card: {
    textColor: string;
    primary: {
      backgroundColor: string;
      borderColor: string;
      boxShadow: string;
    };
    dragging: {
      backgroundColor: string;
      borderColor: string;
      boxShadow: string;
    };
    grouping: {
      backgroundColor: string;
      borderColor: string;
      boxShadow: string;
    };
  };
  column: {
    primary: {
      backgroundColor: string;
    };
    draggingOver: {
      backgroundColor: string;
    };
    draggingFrom: {
      backgroundColor: string;
    };
  };
};

export { type Theme };
