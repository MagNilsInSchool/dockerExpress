export const isApositiveIntegerAtMost9Digits = (n: number): boolean => {
    return Number.isInteger(n) && n >= 1 && n <= 999_999_999;
};
