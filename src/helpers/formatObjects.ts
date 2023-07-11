import { Opportunity } from 'src/opportunities/schema/opportunity.schema';
import { Product } from 'src/types/product';
import { json2xml } from 'xml-js';

export function formatOpportunity(
  opportunity: any,
  products: any,
): Opportunity {
  const productsFormatted = products.length
    ? products.map((product) => {
        return {
          id: product.id,
          name: product?.name,
          quantity: product?.quantity,
          price: product?.item_price,
        };
      })
    : [];

  const opportunitiesFormatted = {
    orderId: opportunity.id,
    creator: {
      id: opportunity.creator_user_id.id,
      name: opportunity.creator_user_id.name,
      email: opportunity?.creator_user_id?.email,
    },
    contact: {
      name: opportunity?.person_id?.name,
      email: opportunity?.person_id?.email[0]?.value,
      phone: opportunity?.person_id?.phone[0]?.value,
    },
    organization: {
      name: opportunity?.org_id?.name,
    },
    title: opportunity?.title,
    value: opportunity?.value,
    date: new Date(opportunity?.add_time),
    quantity: opportunity?.products_count || 1,
    products: productsFormatted,
  };

  return opportunitiesFormatted;
}

export function formatOrderToSave(order: Opportunity) {
  const products =
    order.products.length > 0
      ? order.products.map((product: Product) => {
          return {
            item: {
              codigo: product.id,
              descricao: product.name,
              qtde: product.quantity,
              vlr_unit: product.price,
            },
          };
        })
      : {
          item: {
            codigo: order.orderId,
            descricao: order.title,
            qtde: 1,
            vlr_unit: 10,
          },
        };
  const orderFormatted = {
    pedido: {
      numero: order.orderId,
      data:
        order.date.getDate() +
        '/' +
        order.date.getMonth() +
        '/' +
        order.date.getFullYear(),
      cliente: {
        nome: order.contact.name,
        fone: order?.contact.phone,
        email: order?.contact.email,
      },
      items: products,
    },
  };
  const xml = json2xml(JSON.stringify(orderFormatted), {
    compact: true,
    spaces: 1,
  });
  return xml;
}
