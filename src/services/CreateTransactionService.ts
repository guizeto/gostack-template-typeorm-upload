import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('insufficient funds');
    }

    const categoryIsExist = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryIsExist) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);

      const transaction = transactionRepository.create({
        title,
        value,
        type,
        category_id: newCategory.id,
      });

      await transactionRepository.save(transaction);

      return transaction;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryIsExist.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
