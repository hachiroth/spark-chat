import dayjs from 'dayjs';

// 2025-07-25T08:51:31.223Z -> 08:51:31
export function onlyTime(date: string): string {
  return dayjs(date).format('HH:mm:ss');
}