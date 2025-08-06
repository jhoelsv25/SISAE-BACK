import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('modules')
export class Module extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  path: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  icon: string;

  @ManyToOne(() => Module, module => module.children, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  parent: Module | null;

  @OneToMany(() => Module, module => module.parent, {
    cascade: true,
  })
  children: Module[];
}
