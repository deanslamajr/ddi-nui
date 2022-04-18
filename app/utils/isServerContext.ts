const isServerContext = (): boolean => typeof document === "undefined";
export default isServerContext;
