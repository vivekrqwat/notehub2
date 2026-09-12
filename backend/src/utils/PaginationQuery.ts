import { PaginationQuery } from "../Interfaces/Interface";



export const getPaginationOptions = (query: any, maxLimit = 100): PaginationQuery => {
  const page = Math.max(parseInt(query.page as string, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit as string, 10) || 10, 1), maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
