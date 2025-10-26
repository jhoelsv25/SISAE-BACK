import { FilterBaseDto } from '@common/dtos/filter-base.dto';

export class FilterPersonDto extends FilterBaseDto {
  gender?: string;

  ageMin?: number;

  ageMax?: number;
}
