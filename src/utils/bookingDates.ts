export function normalizeDate(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

export function rangesOverlap(
    newStart: Date,
    newEnd: Date,
    existingStart: Date,
    existingEnd: Date
): boolean {
    return newStart < existingEnd && newEnd > existingStart;
}

export function getBlockedCheckInDates(bookings: { dateFrom: string; dateTo: string }[]): Date[] {
    const dates: Date[] = [];
    for (const b of bookings) {
        const start = normalizeDate(new Date(b.dateFrom));
        const end = normalizeDate(new Date(b.dateTo));
        const cur = new Date(start);
        while (cur < end) {
            dates.push(new Date(cur));
            cur.setDate(cur.getDate() + 1);
        }
    }
    return dates;
}

export function getBlockedCheckOutDates(bookings: { dateFrom: string; dateTo: string }[]): Date[] {
    const dates: Date[] = [];
    for (const b of bookings) {
        const start = normalizeDate(new Date(b.dateFrom));
        const end = normalizeDate(new Date(b.dateTo));
        const cur = new Date(start);
        cur.setDate(cur.getDate() + 1);
        while (cur <= end) {
            dates.push(new Date(cur));
            cur.setDate(cur.getDate() + 1);
        }
    }
    return dates;
}