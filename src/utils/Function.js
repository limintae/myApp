export function createWarning(funcName) {
    return () => console.warn(funcName + ' is not defined');
}

export function setChartColorByType(type) {
    let color;
    switch (type) {
        case 'attack':
            color = '#4b79a5';
            break;
        case 'special':
            color = '#e8de56';
            break;
        case 'chanburst':
        case 'extra':
            color = '#d0565b';
            break;
        default:
            color = '#4b79a5';
            break;
    }
    return color;
}

export function setChartTotalColorByType(type) {
    let color;
    switch (type) {
        case 'chanburst':
        case 'extra':
            color = '#d0565b';
            break;
        default:
            color = '#4b79a5';
            break;
    }
    return color;
}

