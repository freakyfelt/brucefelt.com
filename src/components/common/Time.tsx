interface TimeProps {
    dateTime: string;
    variant?: "absolute";
    className?: string;
}

export function Time({ dateTime, variant = "absolute", className }: TimeProps) {
    // For now, we only support 'absolute' variant which renders the timestamp as is.
    // The timestamp should be in ISO8601 compatible format.
    return (
        <time dateTime={dateTime} className={className}>
            {dateTime}
        </time>
    );
}
