import { FilterBaseDto } from '../../../common/dtos/filter-base.dto';

export class FilterNotificationDto extends FilterBaseDto {
  title?: string;
  content?: string;
  recipientId?: string;
}
