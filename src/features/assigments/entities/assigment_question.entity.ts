import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AssigmentQuestionType } from '../enums/assigment-question.enum';
import { AssigmentEntity } from './assigment.entity';
import { AssigmentQuestionOptionEntity } from './assigment_question_option.entity';

@Entity({ name: 'assigment_questions' })
export class AssigmentQuestionEntity extends BaseEntity {
  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'enum', enum: AssigmentQuestionType })
  type: AssigmentQuestionType;

  @Column({ type: 'int', default: 1 })
  orderIndex: number;

  @Column({ type: 'int', default: 1 })
  points: number;

  @Column({ type: 'boolean', default: true })
  required: boolean;

  @ManyToOne(() => AssigmentEntity, (assignment) => assignment.questions)
  @JoinColumn({ name: 'assigment_id' })
  assigment: AssigmentEntity;

  @OneToMany(() => AssigmentQuestionOptionEntity, (option) => option.question)
  options: AssigmentQuestionOptionEntity[];
}
