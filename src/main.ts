import { SwaggerModule } from '@nestjs/swagger';

import { nestServer } from './server';

// Local
nestServer().then(async (app) => {
  const port = process.env.PORT || 3200;

  const docs = require('../../dist/swagger.json');
  docs.servers = [{ url: `http://localhost:${port}` }];
  SwaggerModule.setup('docs', app, docs);

  await app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
});
