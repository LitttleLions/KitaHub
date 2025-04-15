
import { Company } from './company';

export interface Job {
  id: string;
  title: string;
  company_id: string;
  company_name?: string;
  company_logo?: string;
  location: string;
  type: string;
  salary: string;
  posted_date: string;
  employment_start: string;
  experience: string;
  education: string;
  description: string;
  requirements: string[];
  benefits: string[];
  kita_image_url: string;
  featured: boolean;
  clickable: boolean;
  created_at: string;
  updated_at: string;
  expired_at?: string;
  company?: Company;
}

export * from './company';
