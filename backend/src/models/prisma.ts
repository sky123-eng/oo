// 简化的数据库模型，用于演示

// 交易模型接口
export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: string;
  monetaryAmount: number;
  humanValueAmount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  riskLevel: string;
}

// 参考价值模型接口
export interface ReferenceValue {
  id: string;
  label: string;
  defaultValue: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 模拟的Prisma客户端
export class PrismaClient {
  private transactions: Transaction[] = [];
  private referenceValues: ReferenceValue[] = [];
  private idCounter = 1;

  // 生成唯一ID
  private generateId(): string {
    return `id_${this.idCounter++}`;
  }

  // 交易相关方法
  transaction = {
    create: async (data: any): Promise<Transaction> => {
      const transaction: Transaction = {
        id: this.generateId(),
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        type: data.type,
        monetaryAmount: data.monetaryAmount,
        humanValueAmount: data.humanValueAmount,
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: data.status || 'PENDING',
        riskLevel: data.riskLevel || 'NORMAL'
      };
      this.transactions.push(transaction);
      return transaction;
    },

    findMany: async (params: any): Promise<Transaction[]> => {
      let filtered = this.transactions;
      
      // 简单的过滤逻辑
      if (params.where) {
        if (params.where.fromUserId) {
          filtered = filtered.filter(t => t.fromUserId === params.where.fromUserId);
        }
        if (params.where.toUserId) {
          filtered = filtered.filter(t => t.toUserId === params.where.toUserId);
        }
        if (params.where.type) {
          filtered = filtered.filter(t => t.type === params.where.type);
        }
        if (params.where.status) {
          filtered = filtered.filter(t => t.status === params.where.status);
        }
        if (params.where.riskLevel) {
          filtered = filtered.filter(t => t.riskLevel === params.where.riskLevel);
        }
        if (params.where.createdAt) {
          if (params.where.createdAt.gte) {
            filtered = filtered.filter(t => t.createdAt >= params.where.createdAt.gte);
          }
          if (params.where.createdAt.lte) {
            filtered = filtered.filter(t => t.createdAt <= params.where.createdAt.lte);
          }
        }
        if (params.where.OR) {
          filtered = filtered.filter(t => 
            params.where.OR.some((condition: any) => {
              if (condition.fromUserId) return t.fromUserId === condition.fromUserId;
              if (condition.toUserId) return t.toUserId === condition.toUserId;
              return false;
            })
          );
        }
      }

      // 排序
      if (params.orderBy?.createdAt === 'desc') {
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      // 分页
      if (params.skip !== undefined && params.take !== undefined) {
        filtered = filtered.slice(params.skip, params.skip + params.take);
      }

      return filtered;
    },

    findUnique: async (params: any): Promise<Transaction | null> => {
      return this.transactions.find(t => t.id === params.where.id) || null;
    },

    update: async (params: any): Promise<Transaction> => {
      const index = this.transactions.findIndex(t => t.id === params.where.id);
      if (index === -1) {
        throw new Error('Transaction not found');
      }
      
      this.transactions[index] = {
        ...this.transactions[index],
        ...params.data,
        updatedAt: new Date()
      };
      
      return this.transactions[index];
    },

    count: async (params: any): Promise<number> => {
      const filtered = await this.transaction.findMany(params);
      return filtered.length;
    },

    aggregate: async (params: any): Promise<any> => {
      const filtered = await this.transaction.findMany(params);
      const sum = filtered.reduce((acc, t) => acc + t.humanValueAmount, 0);
      return { _sum: { humanValueAmount: sum } };
    }
  };

  // 参考价值相关方法
  referenceValue = {
    upsert: async (params: any): Promise<ReferenceValue> => {
      const existing = this.referenceValues.find(rv => rv.label === params.where.label);
      
      if (existing) {
        // 更新
        Object.assign(existing, params.update, { updatedAt: new Date() });
        return existing;
      } else {
        // 创建
        const newRv: ReferenceValue = {
          id: this.generateId(),
          label: params.create.label,
          defaultValue: params.create.defaultValue,
          description: params.create.description,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.referenceValues.push(newRv);
        return newRv;
      }
    }
  };
}

// 创建Prisma客户端实例
const prisma = new PrismaClient();

export default prisma;