import { config } from 'dotenv';
config();

import { ethPersonalSign } from '@polybase/eth';
import { PolybaseService } from '~/shared/polybase';

import { first, map, toPairs } from 'lodash';
import * as collections from '~/dbcollections';

const polybaseService = new PolybaseService();

const db = polybaseService.app(process.env.POLYBASE_APP || 'unavailable');

db.signer((data) => {
  return {
    h: 'eth-personal-sign',
    sig: ethPersonalSign(process.env.PRIVATE_KEY || 'unavailable', data),
  };
});

Promise.all(
  map(toPairs(collections), ([key, collection]) => {
    return db
      .applySchema(collection)
      .then((collections) => {
        const name = first(collections)?.name();
        console.log(`${name} schema successfully applied`);
      })
      .catch((reason) => {
        console.log(`Error applying ${key} schema`);
        console.log(`Reason: ${reason}`);
      });
  }),
);
