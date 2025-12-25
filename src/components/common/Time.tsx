import { formatDate, formatRelativeTime } from "@/lib/utils/time";

interface TimeProps {
  dateTime: string;
  variant?: "absolute" | "relative";
  className?: string;
}

type RelativeTimeProps = TimeProps & {
  variant: "relative";
  /** Optional base date for relative time calculation. Defaults to now */
  from?: Date;
};

export function Time(props: TimeProps | RelativeTimeProps) {
  const {
    dateTime,
    className,
    variant = "absolute",
    from,
  } = props as RelativeTimeProps;
  const displayTime =
    variant === "relative"
      ? formatRelativeTime(dateTime, undefined, from)
      : formatDate(dateTime);

  return (
    <time dateTime={dateTime} title={dateTime} className={className}>
      {displayTime}
    </time>
  );
}
