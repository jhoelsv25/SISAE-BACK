import { BaseEntity } from '@common/entities/base.entity';
import { GuardianRelationship } from '@features/guardians/enums/guardian.enum';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'guardians' })
export class GuardianEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  occupation: string;

  @Column({ type: 'varchar', length: 100 })
  workplace: string;

  @Column({ type: 'text' })
  workplaceAddress: string;

  @Column({ type: 'text' })
  workplacePhone: string;

  @Column({ type: 'varchar', length: 100 })
  educationLevel: string;
  @Column({ type: 'int' })
  monthlyIncome: number; // ingreso mensual en moneda local

  @Column({ type: 'boolean' })
  livesWithStudent: boolean;

  @Column({ type: 'boolean' })
  isPrimaryGuardian: boolean;

  @Column({ type: 'enum', enum: GuardianRelationship })
  relationship: GuardianRelationship;

  @ManyToOne(() => PersonEntity)
  person: PersonEntity;
}
