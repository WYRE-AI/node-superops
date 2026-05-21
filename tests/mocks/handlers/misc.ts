/**
 * MSW handlers for non-resource test scenarios (rate limiting, server errors).
 */

import { HttpResponse } from 'msw';
import { superopsApi } from '../shared.js';

export const miscHandlers = [
  // Rate limit simulation
  superopsApi.query('RateLimited', () => {
    return HttpResponse.json({
      errors: [{ message: 'Rate limit exceeded', extensions: { code: 'RATE_LIMITED' } }],
    });
  }),

  // Server error simulation
  superopsApi.query('ServerError', () => {
    return HttpResponse.json({
      errors: [
        { message: 'Internal server error', extensions: { code: 'INTERNAL_SERVER_ERROR' } },
      ],
    });
  }),
];
