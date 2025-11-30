import { Router } from 'express';
import transactionController from '../controllers/transactionController';

const router = Router();

// 交易相关路由
router.post('/transactions', transactionController.createTransaction);
router.get('/transactions', transactionController.getTransactions);
router.get('/transactions/:id', transactionController.getTransactionById);
router.post('/transactions/:id/review', transactionController.reviewTransaction);

export default router;