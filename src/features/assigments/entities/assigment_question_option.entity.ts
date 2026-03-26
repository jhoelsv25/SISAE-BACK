import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AssigmentQuestionEntity } from './assigment_question.entity';

@Entity({ name: 'assigment_question_options' })
export class AssigmentQuestionOptionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'boolean', default: false })
  isCorrect: boolean;

  @Column({ type: 'int', default: 1 })
  orderIndex: number;

  @ManyToOne(() => AssigmentQuestionEntity, (question) => question.options)
  @JoinColumn({ name: 'question_id' })
  question: AssigmentQuestionEntity;
}
