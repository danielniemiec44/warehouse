import {CategoryFieldTypes} from "./CategoryFieldTypes";

interface CategoryTypes {
    id: number;
    name: string;
    customFields: CategoryFieldTypes[];
}

export type {CategoryTypes};