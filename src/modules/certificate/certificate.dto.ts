import {
  IsDefined,
  IsIn,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

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

export class PolybaseCertificate {
  @IsDefined()
  @IsUUID()
  id: string;

  @IsString()
  title?: string;

  @IsString()
  owner?: string;

  @IsString()
  description?: string;

  @IsDefined()
  @ValidateNested()
  reference!: Reference;

  minted?: boolean;
  image?: string;
}

class Certificate {
  /**
   * Description of the certificate
   * @example "New Certificate"
   */
  @IsString()
  description?: string;

  /**
   * Reference to the item or collection
   */
  @IsDefined()
  reference: Reference;
}

export class CreateCertificate extends Certificate {}

export class UpdateCertificate extends Certificate {}

