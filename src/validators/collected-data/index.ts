import { IsInt, IsString } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Collect form data payload',
  name: 'CollectDataDto',
})
export class CollectDataDto {
  @ApiModelProperty({
    description: 'fieldId of form',
    required: true,
    example: 1,
  })
  @IsInt()
  fieldId: number;

  @ApiModelProperty({
    description: 'data related to field',
    required: true,
    example: ['Tien Nguyen'],
  })
  @IsString({ each: true })
  data: string[];
}
