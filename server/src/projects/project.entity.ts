import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column('text', { array: true, default: '{}' })
  technologies!: string[];

  @Column({ nullable: true })
  repositoryUrl?: string;

  @Column({ nullable: true })
  demoUrl?: string;
}
