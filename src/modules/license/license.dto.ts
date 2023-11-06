import { IsNotEmpty, IsString } from 'class-validator';

export class LicenseModel {
  /**
   * Identifier of the license
   * @example "ATR"
   */
  @IsNotEmpty()
  @IsString()
  id!: string;

  /**
   * Name of the license
   * @example "Attribute"
   */
  @IsNotEmpty()
  @IsString()
  name!: string;

  /**
   * Description of the license
   * @example "This license allows you to attribute the author of the work"
   */
  @IsNotEmpty()
  @IsString()
  description!: string;

  /**
   * URL to the license
   * @example "https://creativecommons.org/licenses/by/4.0/"
   */
  @IsString()
  symbol: string;

  /**
   * Family of the license
   * @example "Creative Commons"
   */
  @IsString()
  family: string;
}
