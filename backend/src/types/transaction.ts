// 交易相关的类型定义

export enum TransactionType {
  PHYSICAL_SALE = 'PHYSICAL_SALE',
  BARTER = 'BARTER',
  FAVOR_GIFT = 'FAVOR_GIFT',
  LABOR_SERVICE = 'LABOR_SERVICE',
  MIXED = 'MIXED'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export enum RiskLevel {
  NORMAL = 'NORMAL',
  REVIEW = 'REVIEW',
  BLOCKED = 'BLOCKED'
}

// 创建交易的请求体
export interface CreateTransactionRequest {
  fromUserId: string;
  toUserId: string;
  type: TransactionType;
  monetaryAmount: number;
  humanValueAmount: number;
  description: string;
}

// 交易的响应体
export interface TransactionResponse {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: TransactionType;
  monetaryAmount: number;
  humanValueAmount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: TransactionStatus;
  riskLevel: RiskLevel;
}

// 查询交易的过滤条件
export interface TransactionFilter {
  userId?: string;
  fromUserId?: string;
  toUserId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  riskLevel?: RiskLevel;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// 审核交易的请求体
export interface ReviewTransactionRequest {
  riskLevel: RiskLevel;
  status?: TransactionStatus;
  reason?: string;
}

// 响应格式
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}