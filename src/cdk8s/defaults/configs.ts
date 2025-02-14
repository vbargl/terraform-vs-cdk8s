import * as kplus from "cdk8s-plus-28";
import * as names from "./name";
import * as limits from "./deployment";

export interface Config {
  nameFunction?: names.NameFunction;
  labels: Record<string, string>;
  securityContext?: kplus.ContainerSecurityContextProps;
  resources?: kplus.ContainerResources;
}

export const WithDefaults = <C extends Partial<Config>, D extends Partial<C>>(
  config: C,
  defaults: D = {} as D,
): C & D & Required<Config> => ({
  ...config,
  ...defaults,
  nameFunction: v(
    config.nameFunction,
    defaults.nameFunction,
    names.SimpleNameFunction,
  ),
  labels: v(config.labels, defaults.labels, {}),
  securityContext: v(
    config.securityContext,
    defaults.securityContext,
    limits.securityContext,
  ),
  resources: v(config.resources, defaults.resources, limits.resources),
});

function v<T>(...args: (T | undefined)[]): T {
  for (const arg of args) {
    if (arg !== undefined) {
      return arg;
    }
  }
  throw new Error("No value provided");
}
