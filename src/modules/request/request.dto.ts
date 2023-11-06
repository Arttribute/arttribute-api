import { IsString, IsNotEmpty, IsDefined, IsIn, IsUUID } from 'class-validator';

import { User } from '../user/user.dto';

class Reference {
  /**
   * @example "item"
   */
  @IsDefined()
  @IsIn(['item', 'collection'])
  type!: 'item' | 'collection';

  /**
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @IsDefined()
  @IsUUID()
  id!: string;
}

export class CreateRequest {
  /**
   * The note from the sender
   * @example "Accept this request"
   */
  @IsString()
  senderNote?: string;

  /**
   * Reference to the item or collection
   */
  @IsDefined()
  reference!: Reference;
}

export class UpdateRequest {
  /**
   * Whether or not the request has been accepted
   * @example true
   */
  @IsNotEmpty()
  accepted: boolean;

  /**
   * The note from the receiver
   * @example "I accept this request"
   */
  @IsString()
  receiverNote: string;

  /**
   * The note from the sender
   * @example "Accept this request"
   */
  @IsNotEmpty()
  @IsString()
  senderNote: string;
}

export class PermissionRequest {
  /**
   * The request's UUID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @IsNotEmpty()
  @IsUUID()
  id: string;

  /**
   * Reference to the item or collection
   */
  @IsDefined()
  reference!: Reference;

  /**
   * The sender of the request
   */

  @IsDefined()
  sender!: User;

  /**
   * The receiver of the request
   */
  @IsDefined()
  receiver!: User;

  /**
   * The note from the sender
   * @example "Accept this request"
   */
  @IsString()
  senderNote?: string;

  /**
   * The note from the receiver
   * @example "I accept this request"
   */
  @IsString()
  receiverNote?: string;

  /**
   * Whether or not the request has been accepted
   * @example true
   */
  @IsNotEmpty()
  accepted: boolean;

  /**
   * Whether or not the request has been closed
   * @example false
   */
  @IsNotEmpty()
  closed: boolean;

  /**
   * The date the request was created
   * @example "2021-01-01T00:00:00.000Z"
   */
  @IsNotEmpty()
  created: string;

  /**
   * The date the request was updated
   * @example "2021-01-01T00:00:00.000Z"
   */
  @IsNotEmpty()
  updated: string;
}
