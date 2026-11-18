import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/uz-latn";

dayjs.extend(relativeTime);

/** "5 daqiqa oldin" style time relative to now */
export const fromNow = (date: string | Date): string =>
  dayjs(date).locale("uz-latn").fromNow();
