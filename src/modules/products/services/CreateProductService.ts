import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    /* Verificar se o Produto existe se existir gera um erro */
    const productExists = await this.productsRepository.findByName(name);

    if (productExists) {
      throw new AppError('This product already exists');
    }

     /* Cria uma constante chamada product para depois ser repassada a interface.
       A interface se encarrega em passar para classe que irá tratar com os dados
       para serem salvos no banco de dados.
    */
    const product = await this.productsRepository.create({
      name, price, quantity,
    });

    return product;
  }
}

export default CreateProductService;
