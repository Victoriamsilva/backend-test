import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { getUrl } from 'src/helpers/getUrl';
import {
  formatOpportunity,
  formatOrderToSave,
  formatProducts,
} from 'src/helpers/formatObjects';
import { Opportunity } from './entities/opportunity.entity';
import { Product } from 'src/types/product';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly httpService: HttpService) {}

  async findAllOpportunities(): Promise<Opportunity[]> {
    const url = getUrl({
      endpoint: 'PIPEDRIVE',
      route: 'deals',
      parammeters: '&status=won',
    });

    try {
      const { data }: any = await this.httpService.axiosRef
        .get(url)
        .then((res) => res.data);
      const opportunities = [];

      for (const opportunity of data) {
        const products = await this.findProductsByOpportunityId(opportunity.id);
        opportunities.push({
          ...formatOpportunity(opportunity),
          ...(products
            ? {
                products: formatProducts(products),
              }
            : {}),
        });
      }

      return opportunities;
    } catch (error) {
      console.log(error);
    }
  }

  async findProductsByOpportunityId(id: number): Promise<Product[]> {
    const url = getUrl({
      endpoint: 'PIPEDRIVE',
      route: `deals/${id}/products`,
    });

    try {
      const { data }: any = await this.httpService.axiosRef
        .get(url)
        .then((res) => res.data);

      const products = data ? formatProducts(data) : undefined;

      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async findOneOrder(number: number) {
    const url = getUrl({
      endpoint: 'BLING',
      route: `pedido/${number}/json`,
    });

    try {
      const { retorno }: any = this.httpService.axiosRef
        .get(url)
        .then((res) => res.data);

      return retorno;
    } catch (error) {
      return console.log(error);
    }
  }

  async createOrderOnBling() {
    try {
      const opportunities: Opportunity[] = await this.findAllOpportunities();

      for (const opportunity of opportunities) {
        const order = await this.findOneOrder(opportunity.id);

        if (!order || order === undefined) {
          const url = getUrl({
            endpoint: 'BLING',
            route: 'pedido/json/',
            parammeters: `&xml=<?xml version="1.0" encoding="UTF-8"?>${formatOrderToSave(
              opportunity,
            )}`,
          });
          await this.httpService.axiosRef.post(url);
        }
      }
    } catch (error) {
      return console.log(error);
    }
  }
}
