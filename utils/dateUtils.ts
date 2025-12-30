export const formatVisitDate = (startDate: string, endDate: string, monthFormat: 'short' | 'long' = 'short'): string => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: monthFormat,
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (startDate === endDate) {
        return formatDate(start);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
};
