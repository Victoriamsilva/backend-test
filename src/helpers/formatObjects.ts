import { Product } from 'src/types/product';
import { json2xml } from 'xml-js';

export function formatOpportunity(opportunity: any) {
  const opportunitiesFormatted = {
    id: opportunity.id,
    creator: {
      id: opportunity.creator_user_id.id,
      name: opportunity.creator_user_id.name,
      email: opportunity?.creator_user_id?.email,
    },
    contact: {
      id: opportunity?.person_id?.value,
      name: opportunity?.person_id?.name,
      email: opportunity?.person_id?.email[0]?.value,
      phone: opportunity?.person_id?.phone[0]?.value,
    },
    organization: {
      id: opportunity?.org_id?.value,
      name: opportunity?.org_id?.name,
    },
    title: opportunity?.title,
  };

  return opportunitiesFormatted;
}

export function formatProducts(products: any): Product[] {
  const productsFormatted = products.map((product) => {
    return {
      id: product.id,
      name: product?.name,
      quantity: product?.quantity,
      price: product?.item_price,
    };
  });
  return productsFormatted;
}

export function formatOrderToSave(order: any) {
  const products = order.products
    ? order.products.map((product) => {
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
          codigo: order.id,
          descricao: order.title,
          qtde: 1,
          vlr_unit: 10,
        },
      };
  const orderFormatted = {
    pedido: {
      numero: order.id,
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
