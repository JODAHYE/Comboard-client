import moment from "moment";

const DateInfo = ({ date }: { date: number }) => {
  return (
    <span>
      {moment().format("YYYYMMDD") === String(date).substring(0, 8)
        ? String(date).substring(8, 10) + ":" + String(date).substring(10, 12)
        : String(date).substring(4, 6) + "/" + String(date).substring(6, 8)}
    </span>
  );
};

export default DateInfo;
