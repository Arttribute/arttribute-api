import { Type } from 'class-transformer';

import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { User } from '../user/user.dto';
import { PolybaseProject } from '../project/project.dto';

class Price {
  /**
   * @example 100
   */
  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  /**
   * @example "KSH"
   */
  @IsNotEmpty()
  @IsString()
  @IsIn(['cUSD', 'ETH'])
  currency!: string;
}

class FileData {
  @IsNotEmpty()
  @IsString()
  data: string;

  @IsString()
  mimetype: string;
}

export class ItemDto {
  /**
   * Name of the item
   * @example "My Item"
   */
  @IsNotEmpty()
  @IsString()
  title: string;

  /**
   * Description of the item
   * @example "This is my item"
   */
  @IsNotEmpty()
  @IsString()
  description: string;

  /**
   * Tags for the item
   * @example ["AI", "ML", "Data Science"]
   */
  @IsString({ each: true })
  @IsArray()
  tags: string[];

  /**
   * Author of the item
   * @example "John Doe"
   */
  @IsNotEmpty()
  @IsString()
  author: string;

  /**
   * Source of the item
   * @example "Arttribute"
   */
  @IsNotEmpty()
  @IsString()
  source: string;

  /**
   * Price for the item
   * @example 100
   */
  // TODO: fix this
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Price)
  price: Price;

  /**
   * Licenses for the item
   * @example ["ATR", "NCM", "NDR"]
   */
  @IsString({ each: true })
  @IsArray()
  @IsIn(['ATR', 'NCM', 'NDR', 'SHA'], { each: true })
  license: string[];

  /**
   * Whether the item needs request or not
   * @example true
   */
  @IsNotEmpty()
  @IsBoolean()
  needsRequest: boolean;
}

export class ItemResponse extends ItemDto {
  /**
   * The item's UUID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;

  /**
   * The item's owner
   */
  owner: User;

  /**
   * The item's project
   */
  project: PolybaseProject;

  /**
   * The item's URL
   * @example "https://arttribute.xyz/item/123e4567-e89b-12d3-a456-426614174000"
   */
  url: string;

  /**
   * The item's price
   */
  price: Price;

  /**
   * The date the network was created
   * @example "2021-01-01T00:00:00.000Z"
   */
  created: string;

  /**
   * The date the network was last updated
   * @example "2021-01-01T00:00:00.000Z"
   */
  updated: string;
}

export class CreateItemDto extends ItemDto {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FileData)
  file: FileData;
}

export class UpdateItemDto extends ItemDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  url: string;
  @IsString({ each: true })
  @IsArray()
  tags: string[];
  @IsString()
  author: string;
  @IsString()
  source: string;
  @IsObject()
  @ValidateNested()
  @Type(() => Price)
  price: Price;
  @IsString({ each: true })
  @IsArray()
  license: string[];
  @IsBoolean()
  needsRequest: boolean;
}
