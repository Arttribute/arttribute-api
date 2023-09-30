import { Type } from 'class-transformer';
import {
  IsArray,
  IsBooleanString,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsString,
  IsIn,
  ValidateNested,
} from 'class-validator';

class Price {
  @IsNotEmpty()
  @IsNumber()
  amount!: number;

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
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  source: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Price)
  price: Price;

  @IsString({ each: true })
  @IsArray()
  @IsIn(['ATR', 'NCM', 'NDR', 'SHA'], { each: true })
  license: string[];

  @IsNotEmpty()
  @IsBoolean()
  needsRequest: boolean;
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
