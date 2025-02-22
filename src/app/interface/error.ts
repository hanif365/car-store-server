export type TErrorDetails = {
    path?: string | number;
    details: string;
  }[];
  
  export type TGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorDetails: TErrorDetails;
  };
  