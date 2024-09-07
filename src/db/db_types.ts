import type { Tables, TablesInsert, TablesUpdate } from './supabase_types';

type DateFields = 'start_date' | 'end_date';
type WithDateFields<T> = Omit<T, DateFields> & Record<DateFields, Date | undefined>;

export type Family = Tables<'families'>;
export type FamilyInsert = TablesInsert<'families'>;
export type FamilyUpdate = TablesUpdate<'families'>;

export type FamilyUsersInsert = TablesInsert<'family_users'>;
export type FamilyUsersUpdate = TablesUpdate<'family_users'>;

export type Location = WithDateFields<Tables<'locations'>>;
export type LocationInsert = WithDateFields<TablesInsert<'locations'>>;
export type LocationUpdate = WithDateFields<TablesUpdate<'locations'>>;

export type Moment = WithDateFields<Tables<'moments'>>;
export type MomentInsert = WithDateFields<TablesInsert<'moments'>>;
export type MomentUpdate = WithDateFields<TablesUpdate<'moments'>>;

export type Pet = WithDateFields<Tables<'pets'>>;
export type PetInsert = WithDateFields<TablesInsert<'pets'>>;
export type PetUpdate = WithDateFields<TablesUpdate<'pets'>>;

export type Photo = Tables<'photos'>;
export type PhotoInsert = TablesInsert<'photos'>;
export type PhotoUpdate = TablesUpdate<'photos'>;

export type User = Tables<'users'>;
export type UserInsert = TablesInsert<'users'>;
export type UserUpdate = TablesUpdate<'users'>;


