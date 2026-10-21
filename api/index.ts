import { handleApiRequest } from './_handler';

export default async function handler(req: any, res: any) {
  return handleApiRequest(req, res);
}
