import { Request, Response } from 'express';
import transactionService from '../services/transactionService';
import { CreateTransactionRequest, TransactionFilter, ReviewTransactionRequest, ApiResponse } from '../types/transaction';

/**
 * 交易控制器，处理交易相关的HTTP请求
 */
class TransactionController {
  /**
   * 创建交易
   * @param req Express请求对象
   * @param res Express响应对象
   */
  async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateTransactionRequest = req.body;
      
      // 调用服务创建交易
      const transaction = await transactionService.createTransaction(data);

      // 返回成功响应
      const response: ApiResponse<any> = {
        success: true,
        message: '交易创建成功',
        data: transaction
      };

      res.status(201).json(response);
    } catch (error) {
      // 返回错误响应
      const response: ApiResponse<any> = {
        success: false,
        error: {
          code: 'TRANSACTION_CREATE_FAILED',
          message: error instanceof Error ? error.message : '交易创建失败'
        }
      };

      res.status(400).json(response);
    }
  }

  /**
   * 查询交易列表
   * @param req Express请求对象
   * @param res Express响应对象
   */
  async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const filter: TransactionFilter = req.query as any;
      
      // 转换分页参数
      if (filter.page) {
        filter.page = Number(filter.page);
      }
      if (filter.limit) {
        filter.limit = Number(filter.limit);
      }

      // 调用服务查询交易
      const result = await transactionService.getTransactions(filter);

      // 返回成功响应
      const response: ApiResponse<any> = {
        success: true,
        data: {
          transactions: result.transactions,
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            pages: Math.ceil(result.total / result.limit)
          }
        }
      };

      res.status(200).json(response);
    } catch (error) {
      // 返回错误响应
      const response: ApiResponse<any> = {
        success: false,
        error: {
          code: 'TRANSACTION_QUERY_FAILED',
          message: error instanceof Error ? error.message : '交易查询失败'
        }
      };

      res.status(500).json(response);
    }
  }

  /**
   * 获取交易详情
   * @param req Express请求对象
   * @param res Express响应对象
   */
  async getTransactionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // 调用服务获取交易详情
      const transaction = await transactionService.getTransactionById(id);

      if (!transaction) {
        const response: ApiResponse<any> = {
          success: false,
          error: {
            code: 'TRANSACTION_NOT_FOUND',
            message: '交易不存在'
          }
        };
        res.status(404).json(response);
        return;
      }

      // 返回成功响应
      const response: ApiResponse<any> = {
        success: true,
        data: transaction
      };

      res.status(200).json(response);
    } catch (error) {
      // 返回错误响应
      const response: ApiResponse<any> = {
        success: false,
        error: {
          code: 'TRANSACTION_DETAIL_FAILED',
          message: error instanceof Error ? error.message : '获取交易详情失败'
        }
      };

      res.status(500).json(response);
    }
  }

  /**
   * 审核交易
   * @param req Express请求对象
   * @param res Express响应对象
   */
  async reviewTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: ReviewTransactionRequest = req.body;
      
      // 调用服务审核交易
      const transaction = await transactionService.reviewTransaction(id, data);

      // 返回成功响应
      const response: ApiResponse<any> = {
        success: true,
        message: '交易审核成功',
        data: transaction
      };

      res.status(200).json(response);
    } catch (error) {
      // 返回错误响应
      const response: ApiResponse<any> = {
        success: false,
        error: {
          code: 'TRANSACTION_REVIEW_FAILED',
          message: error instanceof Error ? error.message : '交易审核失败'
        }
      };

      res.status(400).json(response);
    }
  }
}

export default new TransactionController();