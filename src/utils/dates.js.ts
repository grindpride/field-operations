import TDate from '@/models/TDate';

export const getJsDate = ({
  year,
  month,
  day,
}:TDate):Date => new Date(year, month, day);

export const getTDate = (date: Date):TDate => ({
  year: date.getFullYear(),
  month: date.getMonth(),
  day: date.getDate(),
});

export const getPrettyDateString = (date: TDate):string => {
  const jsDate = getJsDate(date);
  const month = jsDate
    .toLocaleString('ru', { month: 'short' })
    .split('.')[0]
    .toUpperCase();
  const day = jsDate.getDate();
  const year = jsDate.getFullYear();
  return `${day} ${month} ${year}`;
};
