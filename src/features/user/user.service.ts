import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DBQueryConfig, eq, ExtractTablesWithRelations } from 'drizzle-orm';
import { first } from 'lodash';
import typia from 'typia';
import { CreateUser } from '~/models/user.model';
import { DatabaseService } from '~/modules/database/database.service';
import * as tables from '~/modules/database/schema';
import { InsertUser, User, userTable } from '~/modules/database/schema';
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
  async getUser(
    props: { id: string } | { email: string } | { web3Address: string },
  ) {
    let userEntry: undefined | User;
    if (typia.is<{ id: string }>(props)) {
      const { id } = props;
      userEntry = await this.databaseService.query.userTable.findFirst({
        where: () => eq(userTable.id, id),
      });
      if (!userEntry) {
        throw new NotFoundException(`User with id: ${id} not found`);
      }
    } else if (typia.is<{ email: string }>(props)) {
      const { email } = props;
      userEntry = await this.databaseService.query.userTable.findFirst({
        where: () => eq(userTable.email, email),
      });
      if (!userEntry) {
        throw new NotFoundException(`User with email: ${email} not found`);
      }
    } else if (typia.is<{ web3Address: string }>(props)) {
      const { web3Address } = props;
      userEntry = await this.databaseService.query.userTable.findFirst({
        where: () => eq(userTable.web3Address, web3Address),
      });
      if (!userEntry) {
        throw new NotFoundException(
          `User with web3Address: ${web3Address} not found`,
        );
      }
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
