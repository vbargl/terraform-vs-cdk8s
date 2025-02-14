import * as kplus from "cdk8s-plus-28";
import * as configs from "../../defaults/configs";
import { Construct } from "constructs";

export interface Config extends configs.Config {
  imageTag?: string;
}

export class WhoamiApp extends Construct {
  readonly namespace: kplus.Namespace;
  readonly service: kplus.Service;
  private deployment: kplus.Deployment;

  constructor(scope: Construct, id: string, config: Config) {
    super(scope, id);

    const prefix = "whoami";
    const port = 80;
    const { nameFunction, imageTag, resources, securityContext } =
      configs.WithDefaults(config, { imageTag: "v1.10.4" });

    this.namespace = new kplus.Namespace(
      this,
      nameFunction(prefix, "namespace"),
    );

    this.deployment = new kplus.Deployment(
      this,
      nameFunction(prefix, "deployment"),
      {
        metadata: {
          namespace: this.namespace.name,
          labels: config.labels,
        },
        replicas: 1,
        strategy: kplus.DeploymentStrategy.rollingUpdate({
          maxSurge: kplus.PercentOrAbsolute.absolute(1),
          maxUnavailable: kplus.PercentOrAbsolute.absolute(0),
        }),
        containers: [
          {
            name: nameFunction(prefix, "container"),
            image: `docker.io/traefik/whoami:${imageTag}`,
            ports: [
              {
                name: "web",
                number: port,
              },
            ],
            securityContext,
            resources,
          },
        ],
      },
    );

    this.service = new kplus.Service(this, nameFunction(prefix, "service"), {
      metadata: {
        namespace: this.namespace.name,
        labels: config.labels,
      },

      type: kplus.ServiceType.CLUSTER_IP,
      selector: this.deployment,
      ports: [
        {
          port: port,
          targetPort: port,
        },
      ],
    });
  }

  get address(): string {
    return `${this.service.name}:${this.service.ports[0].port}`;
  }
}
