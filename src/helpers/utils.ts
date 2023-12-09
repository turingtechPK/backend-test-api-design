export const isString = (value: any): boolean => {
    return typeof value === 'string' && value.trim().length > 0;
}

export const isInteger = (value: any): boolean => {
    return Number.isInteger(value) && value > 0;
}