import { INestiaConfig } from '@nestia/sdk';

import { nestServer } from '~/server';

const NESTIA_CONFIG: INestiaConfig = {
  input: nestServer,
  json: true,
  assert: true,
  swagger: {
    output: 'dist/swagger.json',
    security: {
      bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Local Server',
      },
    ],
    beautify: true,
  },
};
export default NESTIA_CONFIG;
