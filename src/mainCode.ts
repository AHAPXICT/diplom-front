export const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
};

export function getTimeAgo(dateString: string) {
    const date = new Date(dateString);

    const seconds = Math.floor(
        (Date.now() - date.getTime()) / 1000
    );

    if (seconds < 60) return 'только что';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} мин назад`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ч назад`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} д назад`;

    return date.toLocaleDateString();
}