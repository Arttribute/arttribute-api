import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class OIDCClient {
  /**
   * The user's UUID
   * @example '12345678-1234-1234-1234-123456789012'
   */
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  redirect: string;

  /**
   * The user's name
   * @example 'John Doe'
   */
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateOIDCClient extends OIDCClient {
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class ValidateOIDCCode {
  @IsNotEmpty()
  @IsString()
  code: string;
}
