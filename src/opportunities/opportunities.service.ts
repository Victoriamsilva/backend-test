import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { getUrl } from 'src/helpers/getUrl';
import {
  formatOpportunity,
  formatOrderToSave,
} from 'src/helpers/formatObjects';
import { Opportunity } from './schema/opportunity.schema';
import { Product } from 'src/types/product';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationProps } from 'src/types/pagination';

@Injectable()
export class OpportunitiesService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel('Opportunity')
    private readonly opportunityModel: Model<Opportunity>,
  ) {}

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

      if (!data) {
        return [];
      }

      for (const opportunity of data) {
        const products = await this.findProductsByOpportunityId(opportunity.id);
        opportunities.push({
          ...formatOpportunity(opportunity, products),
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

      return data ? data : [];
    } catch (error) {
      console.log(error);
    }
  }

  async findOneOrder(number: number) {
    const url = getUrl({
      endpoint: 'BLING',
      route: `pedido/${number}/json/`,
    });

    try {
      const { retorno } = await this.httpService.axiosRef
        .get(url)
        .then((res) => res.data);

      if (retorno?.erros && retorno.erros[0].erro.cod === 14) {
        return {
          msg: 'Pedido não encontrado',
        };
      }
      return retorno;
    } catch (error) {
      console.log(error);
    }
  }

  async createOrderOnBling() {
    try {
      const opportunities: Opportunity[] = await this.findAllOpportunities();
      const ordersCreated = [];

      if (opportunities.length === 0) {
        throw new BadRequestException('Não há oportunidades ganhas');
      }

      for (const opportunity of opportunities) {
        const order = await this.findOneOrder(opportunity.orderId);

        if (order.msg === 'Pedido não encontrado') {
          const parammeters = formatOrderToSave(opportunity);
          const url = getUrl({
            endpoint: 'BLING',
            route: 'pedido/json/',
            parammeters: `&xml=<?xml version="1.0" encoding="UTF-8"?>${parammeters}`,
          });
          const orderCreated = await this.httpService.axiosRef.post(url);
          const hasOrder = await this.opportunityModel.findOne({
            orderId: opportunity.orderId,
          });

          if (!hasOrder) {
            await new this.opportunityModel(opportunity).save();
          }
          ordersCreated.push(orderCreated);
        }
      }

      if (ordersCreated.length > 0) {
        return `${ordersCreated.length} pedidos criados com sucesso`;
      } else {
        throw new BadRequestException('Não há novos pedidos a serem criados');
      }
    } catch (error) {
      return error;
    }
  }

  async findPaginated(
    { page, limit }: PaginationProps,
    search?: string,
    date?: string,
  ) {
    try {
      let query = {};
      const dateQuery = new Date(date);
      dateQuery.setDate(dateQuery.getDate() + 1);

      if (search) {
        query = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { 'contact.name': { $regex: search, $options: 'i' } },
          ],
        };
      }

      if (date) {
        query = {
          ...query,
          date: {
            $gte: new Date(date),
            $lt: dateQuery,
          },
        };
      }

      const opportunities = await this.opportunityModel
        .find(query)
        .skip(page * limit)
        .limit(limit)
        .sort({ date: -1 });

      const count = await this.opportunityModel.countDocuments(query);

      return {
        opportunities,
        count,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getTotal(date?: string, search?: string) {
    try {
      let query = {};
      const dateQuery = new Date(date);
      dateQuery.setDate(dateQuery.getDate() + 1);

      if (search) {
        query = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { 'contact.name': { $regex: search, $options: 'i' } },
          ],
        };
      }

      if (date) {
        query = {
          ...query,
          date: {
            $gte: new Date(date),
            $lt: dateQuery,
          },
        };
      }

      const result = await this.opportunityModel.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$value',
            },
          },
        },
      ]);

      return result[0].total;
    } catch (error) {
      console.log(error);
    }
  }
}
