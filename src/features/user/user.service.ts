import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';
import { first } from 'lodash';
import typia from 'typia';
import { CreateUser } from '~/models/user.model';
import { DatabaseService } from '~/modules/database/database.service';
import * as tables from '~/modules/database/schema';
import { InsertUser, userTable } from '~/modules/database/schema';
import { StorageService } from '~/modules/storage/storage.service';

type Tables = typeof tables;

module UserService {
  export type UserTableQuery = DBQueryConfig<
    'many',
    true,
    ExtractTablesWithRelations<Tables>,
    ExtractTablesWithRelations<Tables>['userTable']
  >;
}

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private storageService: StorageService,
  ) {}

  async createUser(props: { value: CreateUser }) {
    const { value } = props;
    let userEntry = await this.databaseService
      .insert(userTable)
      .values(typia.misc.assertPrune<InsertUser>(value))
      .returning()
      .then(first);

    if (!userEntry) {
      throw new InternalServerErrorException(
        'Error occurred while creating user',
      );
    }

    return userEntry;
  }

  async upsertUser(props: { value: CreateUser }) {
    const { value } = props;
    const userEntry = await this.databaseService
      .insert(userTable)
      .values(typia.misc.assertPrune<InsertUser>(value))
      .returning()
      .onConflictDoNothing()
      .then(first);

    return userEntry;
  }
}
