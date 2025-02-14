import * as kplus from "cdk8s-plus-28";
import { Construct } from "constructs";

export interface CreateServiceProps {
  self: Construct;
  deployment: kplus.Deployment;
  namespace: kplus.Namespace;
  prefix: string;
  nameFunction: (prefix: string, type: string) => string;
  labels: Record<string, string>;
  port: number;
}

export const createService = ({
  self,
  namespace,
  deployment,
  prefix,
  nameFunction,
  labels,
  port,
}: CreateServiceProps): kplus.Service =>
  new kplus.Service(self, nameFunction(prefix, "service"), {
    metadata: {
      namespace: namespace.name,
      labels: {
        ...labels,
        scope: prefix,
      },
    },
    type: kplus.ServiceType.CLUSTER_IP,
    selector: deployment,
    ports: [
      {
        port: port,
        targetPort: port,
      },
    ],
  });
