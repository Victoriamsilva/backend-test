type GetUrl = {
  endpoint: 'BLING' | 'PIPEDRIVE';
  route: string;
  parammeters?: string;
};

export function getUrl({ endpoint, route, parammeters }: GetUrl): string {
  parammeters = parammeters ? parammeters : '';

  if (endpoint === 'BLING') {
    return `${process.env.BLING_URL}${route}${process.env.BLING_TOKEN}${parammeters}`;
  } else if (endpoint === 'PIPEDRIVE') {
    return `${process.env.PIPEDRIVE_URL}${route}${process.env.PIPEDRIVE_TOKEN}${parammeters}`;
  }
}
