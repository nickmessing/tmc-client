/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const typedProp = <T>(type: any) => type as new () => T
export const noop = () => {}
