export interface LinkResponse {
  rel: string;
  href: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
}

export type LinkResponseType = LinkResponse[];

export function createResponse(data: any, _links: LinkResponse[] = []) {
  return {
    data,
    _links,
  };
}
