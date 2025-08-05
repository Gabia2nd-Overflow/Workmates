import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs){
    return twMerge(clsx(inputs)); //충돌문제를 자동으로 정리.
}