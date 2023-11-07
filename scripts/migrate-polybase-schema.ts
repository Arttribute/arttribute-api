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

console.log(`Migrating app: ${process.env.POLYBASE_APP}`);

Promise.all(
  map(toPairs(collections), ([key, collection]) => {
    return db
      .applySchema(collection)
      .then((collections) => {
        const name = first(collections)?.name();
        console.log(
          `[${process.env.POLYBASE_APP}] ${name} schema successfully applied`,
        );
      })
      .catch((reason) => {
        console.log(
          `[${process.env.POLYBASE_APP}] Error applying ${key} schema`,
        );
        console.log(`[${process.env.POLYBASE_APP}] Reason: ${reason}`);
      });
  }),
);
