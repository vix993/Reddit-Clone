import { PropertyOptions } from '.';
import { AnyEntity, Dictionary } from '../typings';
export declare function Enum(options?: EnumOptions<AnyEntity> | (() => Dictionary)): (target: AnyEntity, propertyName: string) => void;
export interface EnumOptions<T> extends PropertyOptions<T> {
    items?: (number | string)[] | (() => Dictionary);
}
