import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class User {
  /**
   * The user's UUID
   * @example '12345678-1234-1234-1234-123456789012'
   */
  @IsNotEmpty()
  @IsString()
  id: string;

  /**
   * The user's public key
   * @example '0x1234567890123456789012345678901234567890'
   */
  @IsNotEmpty()
  @IsNumber()
  publicKey: string;

  /**
   * The user's address
   * @example '0x1234567890123456789012345678901234567890'
   */
  @IsNotEmpty()
  @IsString()
  address: string;

  /**
   * The user's name
   * @example 'John Doe'
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * The date the user was created
   * @example '2021-01-01T00:00:00.000Z'
   */
  @IsNotEmpty()
  @IsString()
  created: string;
}

export class CreateUser extends User {
  @IsString()
  @IsNotEmpty()
  address: string;
}
