// 风控常量定义

// 人情价值月度限额（单位：元）
export const HUMAN_MONTHLY_LIMIT = 10000;

// 同一对用户之间的人情累计金额上限（单位：元）
export const PAIR_HUMAN_LIMIT = 5000;

// 同一对用户之间的交易频次上限（30天内）
export const PAIR_TRANSACTION_LIMIT = 20;

// 高价值限制，超过此值且实付金额接近0时会被拦截
export const HIGH_VALUE_LIMIT = 5000;

// 实付金额阈值，低于此值视为接近0
export const LOW_MONETARY_THRESHOLD = 100;

// 分页默认值
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;