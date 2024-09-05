export const prefix0X = (key: string): string => {
    return `0x${key}`;
  };
  
export enum TransactionStatus {
'READY',
'PENDING',
'STARTED',
'SUCCEEDED',
'FAILED',
'LEDGER_ERROR',
'REJECTED',
}