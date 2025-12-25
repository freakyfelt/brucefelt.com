interface DateTimeProps {
    timestamp: string;
    variant?: "absolute";
    className?: string;
}

export function DateTime({ timestamp, variant = "absolute", className }: DateTimeProps) {
    // For now, we only support 'absolute' variant which renders the timestamp as is.
    // The timestamp should be in ISO8601 compatible format.
    return (
        <time dateTime={timestamp} className={className}>
            {timestamp}
        </time>
    );
}
