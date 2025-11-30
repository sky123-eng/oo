import { Transaction } from '../models/prisma';
import prisma from '../models/prisma';
import riskService, { RiskLevel } from './riskService';

// 交易状态枚举
export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REVIEWING = 'REVIEWING'
}
import { CreateTransactionRequest, TransactionFilter, ReviewTransactionRequest } from '../types/transaction';

/**
 * 交易服务，负责交易的创建、查询和管理
 */
class TransactionService {
  /**
   * 创建新交易
   * @param data 交易数据
   * @returns 创建的交易
   */
  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    try {
      // 验证交易类型和金额
      if (data.type === 'MIXED') {
        if (!data.monetaryAmount && !data.humanValueAmount) {
          throw new Error('混合交易必须同时提供实付金额和人情价值');
        }
      } else if (data.type === 'PHYSICAL_SALE' || data.type === 'BARTER') {
        if (!data.monetaryAmount) {
          throw new Error('实物买卖和以物换物交易必须提供实付金额');
        }
      } else if (data.type === 'FAVOR_GIFT' || data.type === 'LABOR_SERVICE') {
        if (!data.humanValueAmount) {
          throw new Error('人情礼品和劳务交易必须提供人情价值');
        }
      }

      // 调用风控服务评估风险
      const riskLevel = await riskService.assessTransactionRisk({
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        type: data.type,
        monetaryAmount: data.monetaryAmount || 0,
        humanValueAmount: data.humanValueAmount || 0,
        description: data.description
      });

      // 如果风控拒绝，抛出错误
      if (riskLevel === RiskLevel.BLOCKED) {
        throw new Error('交易被风控系统拒绝：禁止用人情替代高额货款');
      }

      // 创建交易记录
      const transaction = await prisma.transaction.create({
        data: {
          ...data,
          status: TransactionStatus.PENDING,
          riskLevel: riskLevel
        }
      });

      return transaction;
    } catch (error) {
      throw new Error(`创建交易失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 验证交易数据的合法性
   * @param data 交易数据
   */
  validateTransactionData(data: CreateTransactionRequest): void {
    // 检查必填字段
    if (!data.fromUserId || !data.toUserId || !data.description) {
      throw new Error('交易创建时缺少必要字段');
    }

    // 检查交易类型
    if (!data.type) {
      throw new Error('交易创建时必须选择type（实物买卖/以物换物/人情礼品/劳务/混合）');
    }

    // 检查金额
    if (data.monetaryAmount < 0 || data.humanValueAmount < 0) {
      throw new Error('金额不能为负数');
    }

    // 如果type为MIXED，需要同时填monetaryAmount和humanValueAmount
    if (data.type === 'MIXED') {
      if (data.monetaryAmount === 0 && data.humanValueAmount === 0) {
        throw new Error('混合交易类型必须同时提供实付金额和人情价值金额');
      }
    }

    // 检查交易描述
    if (data.description.trim().length === 0) {
      throw new Error('交易意图说明不能为空');
    }
  }

  /**
   * 查询交易列表
   * @param filter 过滤条件
   * @returns 交易列表和分页信息
   */
  async getTransactions(filter: TransactionFilter): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      userId,
      fromUserId,
      toUserId,
      type,
      status,
      riskLevel,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = filter;

    // 构建查询条件
    const where: any = {};

    // 用户相关过滤
    if (userId) {
      where.OR = [
        { fromUserId: userId },
        { toUserId: userId }
      ];
    } else {
      if (fromUserId) {
        where.fromUserId = fromUserId;
      }
      if (toUserId) {
        where.toUserId = toUserId;
      }
    }

    // 交易属性过滤
    if (type) {
      where.type = type;
    }
    if (status) {
      where.status = status;
    }
    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    // 时间范围过滤
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // 计算分页偏移量
    const offset = (page - 1) * limit;

    // 查询交易列表
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.transaction.count({ where })
    ]);

    return {
      transactions,
      total,
      page,
      limit
    };
  }

  /**
   * 获取交易详情
   * @param id 交易ID
   * @returns 交易详情
   */
  async getTransactionById(id: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({
      where: { id }
    });
  }

  /**
   * 审核交易
   * @param id 交易ID
   * @param data 审核数据
   * @returns 更新后的交易
   */
  async reviewTransaction(id: string, data: ReviewTransactionRequest): Promise<Transaction> {
    // 检查交易是否存在
    const transaction = await this.getTransactionById(id);
    if (!transaction) {
      throw new Error('交易不存在');
    }

    // 更新交易状态和风险等级
    return prisma.transaction.update({
      where: { id },
      data: {
        riskLevel: data.riskLevel,
        status: data.status || transaction.status
      }
    });
  }

  /**
   * 初始化参考价值数据
   */
  async initializeReferenceValues(): Promise<void> {
    const referenceValues = [
      { label: '家教1小时', defaultValue: 100, description: '中小学家教辅导1小时' },
      { label: '帮忙搬家1次', defaultValue: 200, description: '小型搬家服务1次' },
      { label: '代取快递1次', defaultValue: 10, description: '校园内代取快递1次' },
      { label: '做饭1顿', defaultValue: 80, description: '普通家庭餐1顿（4菜1汤）' },
      { label: '宠物寄养1天', defaultValue: 150, description: '小型宠物寄养1天' },
      { label: '车辆接送1次', defaultValue: 100, description: '同城车辆接送服务1次' },
      { label: '文件翻译1页', defaultValue: 30, description: '普通文档翻译1页（A4）' },
      { label: '摄影服务1小时', defaultValue: 200, description: '普通摄影服务1小时' }
    ];

    // 批量创建参考价值数据
    for (const value of referenceValues) {
      await prisma.referenceValue.upsert({
        where: { label: value.label },
        update: value,
        create: value
      });
    }
  }
}

export default new TransactionService();