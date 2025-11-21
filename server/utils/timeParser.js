function parseTime(timeStr) {
    if (!timeStr) return new Date();

    const now = new Date();
    const cleanStr = timeStr.replace('끌올', '').trim();

    // Relative time patterns
    if (cleanStr.includes('초 전')) {
        const seconds = parseInt(cleanStr.replace(/\D/g, ''));
        return new Date(now.getTime() - seconds * 1000);
    }
    if (cleanStr.includes('분 전')) {
        const minutes = parseInt(cleanStr.replace(/\D/g, ''));
        return new Date(now.getTime() - minutes * 60 * 1000);
    }
    if (cleanStr.includes('시간 전')) {
        const hours = parseInt(cleanStr.replace(/\D/g, ''));
        return new Date(now.getTime() - hours * 60 * 60 * 1000);
    }
    if (cleanStr.includes('일 전')) {
        const days = parseInt(cleanStr.replace(/\D/g, ''));
        return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }
    if (cleanStr.includes('달 전') || cleanStr.includes('개월 전')) {
        const months = parseInt(cleanStr.replace(/\D/g, ''));
        const d = new Date(now);
        d.setMonth(d.getMonth() - months);
        return d;
    }
    if (cleanStr.includes('년 전')) {
        const years = parseInt(cleanStr.replace(/\D/g, ''));
        const d = new Date(now);
        d.setFullYear(d.getFullYear() - years);
        return d;
    }

    // Absolute date patterns (e.g. 2023.11.21)
    // Not common in relative strings but good to have
    return now;
}

module.exports = { parseTime };
