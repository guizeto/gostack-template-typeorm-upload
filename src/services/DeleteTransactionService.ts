import { getRepository } from 'typeorm';

import transaction from '../models/Transaction';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(transaction);

    const transactionExist = await transactionRepository.findOne(id);

    if (!transactionExist) {
      throw new AppError('Transaction does not find');
    }

    await transactionRepository.remove(transactionExist);
  }
}

export default DeleteTransactionService;
