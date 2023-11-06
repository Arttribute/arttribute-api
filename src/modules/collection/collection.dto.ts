import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsNumber,
  IsObject,
  IsBooleanString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LicenseModel } from '../license/license.dto';

class User {
  id: string;
  publicKey: string;
  address: string;
  name: string;
  created: string;
}

// temporary classes for Item
export class Item {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LicenseModel)
  license: LicenseModel[];
}

class Price {
  /**
   * @example 100
   */
  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  /**
   * @example "USD"
   */
  @IsNotEmpty()
  @IsString()
  currency!: string;
}

export class CreateCollection {
  /**
   * Title of the collection
   * @example "Picasso Collection"
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  featureImage: string;

  /**
   * Description of the collection
   * @example "A collection of Picasso's paintings"
   */
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Whether the collection is public or not
   * @example true
   */
  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  /**
   * Tags for the collection
   * @example ["AI", "ML", "Data Science"]
   */
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  tags: string[];

  /**
   * Price for the collection
   */
  @IsObject()
  price!: Price;

  /**
   * Licenses for the collection
   * @example ["ATR", "NCM"]
   */
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  license: string[];

  /**
   * Whether the collection needs request or not
   * @example true
   */
  @IsNotEmpty()
  @IsBoolean()
  needsRequest: boolean;
}

export class CollectionResponse extends CreateCollection {
  id: string;
  items: Item[];
  license: any;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

