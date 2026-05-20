/**
 * Shared MSW mocking primitives for SuperOps API tests.
 */

import { graphql } from 'msw';

/** GraphQL link for the SuperOps MSP API. */
export const superopsApi = graphql.link('https://api.superops.ai/msp');

/** Standard "not found" GraphQL error response. */
export const notFoundError = {
  errors: [{ message: 'Resource not found', extensions: { code: 'NOT_FOUND' } }],
};

/** Standard authentication-failure GraphQL error response. */
export const authenticationError = {
  errors: [{ message: 'Invalid API token', extensions: { code: 'UNAUTHENTICATED' } }],
};

/** Standard validation-failure GraphQL error response. */
export const validationError = {
  errors: [
    {
      message: 'Name is required',
      path: ['input', 'name'],
      extensions: { code: 'BAD_USER_INPUT' },
    },
  ],
};

/** Returns true when the request carries valid SuperOps auth headers. */
export function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  const subdomainHeader = request.headers.get('CustomerSubDomain');

  return (
    authHeader !== null &&
    authHeader.startsWith('Bearer ') &&
    authHeader !== 'Bearer invalid-token' &&
    subdomainHeader !== null &&
    subdomainHeader.length > 0
  );
}
