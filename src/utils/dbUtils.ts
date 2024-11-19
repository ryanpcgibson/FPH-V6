import { prepareDateForDB } from './dateUtils';

type EntityWithDates = {
  start_date?: Date;
  end_date?: Date;
  [key: string]: any;
};

export const prepareEntityForDB = <T extends EntityWithDates>(entity: T) => {
  return {
    ...entity,
    start_date: prepareDateForDB(entity.start_date),
    end_date: prepareDateForDB(entity.end_date),
  };
}; 