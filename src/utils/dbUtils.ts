import { prepareDateForDB, convertStringToDate } from "./dateUtils";
export const prepareEntityForDB = <T extends EntityWithDates>(entity: T) => {
  return {
    ...entity,
    start_date:
      entity.start_date != null ? prepareDateForDB(entity.start_date) : null,
    end_date:
      entity.end_date != null ? prepareDateForDB(entity.end_date) : null,
  };
};

export type EntityWithDates = {
  start_date?: Date | null;
  end_date?: Date | null;
  [key: string]: any;
};

export type EntityWithStringDates = {
  start_date?: string | null;
  end_date?: string | null;
  [key: string]: any;
};
export const convertEntityFromDB = <T extends EntityWithStringDates>(
  entity: T
) => {
  return {
    ...entity,
    start_date: entity.start_date ? convertStringToDate(entity.start_date) : null,
    end_date: entity.end_date ? convertStringToDate(entity.end_date) : null,
  };
};
