import { Size } from "cdk8s";
import {
  ContainerResources,
  ContainerSecurityContextProps,
  Cpu,
} from "cdk8s-plus-28";

export const resources: ContainerResources = {
  cpu: {
    request: Cpu.millis(100),
    limit: Cpu.millis(500),
  },
  memory: {
    request: Size.mebibytes(64),
    limit: Size.mebibytes(512),
  },
};

export const securityContext: ContainerSecurityContextProps = {
  ensureNonRoot: false,
  privileged: true,
  readOnlyRootFilesystem: false,
  allowPrivilegeEscalation: true,
};
