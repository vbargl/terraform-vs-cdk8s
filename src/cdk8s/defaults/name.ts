export type NameFunction = (defaultName: string, type: string) => string;

export const SimpleNameFunction: NameFunction = (defaultName, type) =>
  `${defaultName}-${type}`;
