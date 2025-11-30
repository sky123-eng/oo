import { Transaction } from '../models/prisma';
import prisma from '../models/prisma';
import { HUMAN_MONTHLY_LIMIT, HIGH_VALUE_LIMIT, PAIR_TRANSACTION_LIMIT, PAIR_HUMAN_LIMIT } from '../utils/constants';

// 风险等级枚举
export enum RiskLevel {
  NORMAL = 'NORMAL',
  REVIEW = 'REVIEW',
  BLOCKED = 'BLOCKED'
}

/**
 * 风控服务，负责交易风险评估和管理
 */
class RiskService {
  /**
   * 评估交易风险
   * @param transaction 待评估的交易
   * @returns 风险等级和评估结果
   */
  async assessTransactionRisk(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'riskLevel'>): Promise<RiskLevel> {
    // 1. 检查人情价值是否过高而货币金额接近0（疑似用人情替代货款）
    if (transaction.humanValueAmount > HIGH_VALUE_LIMIT && transaction.monetaryAmount < 100) {
      return RiskLevel.BLOCKED;
    }

    // 2. 检查30天内单个用户的人情累计金额
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const humanValueSum = await prisma.transaction.aggregate({
      where: {
        OR: [
          { fromUserId: transaction.fromUserId },
          { toUserId: transaction.fromUserId }
        ],
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _sum: {
        humanValueAmount: true
      }
    });

    if (humanValueSum._sum.humanValueAmount && 
        (humanValueSum._sum.humanValueAmount + transaction.humanValueAmount) > HUMAN_MONTHLY_LIMIT) {
      return RiskLevel.REVIEW;
    }

    // 3. 检查同一对用户之间的交易频次和金额
    const userPairTransactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            fromUserId: transaction.fromUserId,
            toUserId: transaction.toUserId
          },
          {
            fromUserId: transaction.toUserId,
            toUserId: transaction.fromUserId
          }
        ],
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    if (userPairTransactions.length >= PAIR_TRANSACTION_LIMIT) {
      return RiskLevel.REVIEW;
    }

    const userPairAmountSum = userPairTransactions.reduce((sum, t) => sum + t.humanValueAmount, 0);
    if ((userPairAmountSum + transaction.humanValueAmount) > PAIR_HUMAN_LIMIT) {
      return RiskLevel.REVIEW;
    }

    // 4. 调用机器学习模型进行风险评估（预留接口）
    const mlRiskScore = await this.assessRiskWithML(transaction);
    if (mlRiskScore > 0.7) { // 假设0.7是高风险阈值
      return RiskLevel.REVIEW;
    }

    // 默认正常
    return RiskLevel.NORMAL;
  }

  // 机器学习风险评估（预留接口）
  private async assessRiskWithML(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'riskLevel'>): Promise<number> {
    // 这里是预留的机器学习接口，目前使用简单规则实现
    // 实际项目中可以接入真实的机器学习模型
    let riskScore = 0;

    // 基于交易类型的风险评估
    if (transaction.type === 'FAVOR_GIFT' || transaction.type === 'LABOR_SERVICE') {
      riskScore += 0.2;
    }

    // 基于金额的风险评估
    if (transaction.humanValueAmount > 10000) {
      riskScore += 0.3;
    }

    // 基于描述长度的风险评估（描述过短可能有风险）
    if (transaction.description.length < 10) {
      riskScore += 0.2;
    }

    return riskScore;
  }

  /**
   * 获取用户的30天滚动窗口内的人情累计金额
   * @param userId 用户ID
   * @returns 累计金额
   */
  async getUserHumanValueTotal(userId: string): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.transaction.aggregate({
      _sum: {
        humanValueAmount: true
      },
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId }
        ],
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    return result._sum.humanValueAmount || 0;
  }

  /**
   * 获取用户对之间的交易统计
   * @param userId1 用户1 ID
   * @param userId2 用户2 ID
   * @returns 交易统计信息
   */
  async getPairTransactionStats(userId1: string, userId2: string): Promise<{
    humanValueTotal: number;
    transactionCount: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const humanValueResult = await prisma.transaction.aggregate({
      _sum: {
        humanValueAmount: true
      },
      where: {
        AND: [
          {
            OR: [
              {
                fromUserId: userId1,
                toUserId: userId2
              },
              {
                fromUserId: userId2,
                toUserId: userId1
              }
            ]
          },
          {
            createdAt: {
              gte: thirtyDaysAgo
            }
          }
        ]
      }
    });

    const countResult = await prisma.transaction.count({
      where: {
        AND: [
          {
            OR: [
              {
                fromUserId: userId1,
                toUserId: userId2
              },
              {
                fromUserId: userId2,
                toUserId: userId1
              }
            ]
          },
          {
            createdAt: {
              gte: thirtyDaysAgo
            }
          }
        ]
      }
    });

    return {
      humanValueTotal: humanValueResult._sum.humanValueAmount || 0,
      transactionCount: countResult
    };
  }
}

export default new RiskService();