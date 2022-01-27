type Predicate<T> = (t: T) => boolean;

const not = <T>(fn: Predicate<T>): Predicate<T> => t => !fn(t);

export default not;
