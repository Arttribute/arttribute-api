import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class OAuthClient {
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

export class CreateOAuthClient extends OAuthClient {
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class ValidateOAuthCode {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  secret: string;
}
