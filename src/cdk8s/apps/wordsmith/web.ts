import * as kplus from "cdk8s-plus-28";
import * as configs from "../../defaults/configs";
import { Construct } from "constructs";
import { WordsmithApiComponent } from "./api";
import * as utils from "./utils";

export interface Config extends configs.Config {
  namespace: kplus.Namespace;
  imageTag?: string;
  apiComponent: WordsmithApiComponent;
}

export class WordsmithWebComponent extends Construct {
  readonly service: kplus.Service;
  private deployment: kplus.Deployment;

  constructor(scope: Construct, id: string, config: Config) {
    super(scope, id);

    const prefix = "wordsmith-api";
    const port = 80;
    const {
      namespace,
      apiComponent,
      nameFunction,
      imageTag,
      labels,
      resources,
      securityContext,
    } = configs.WithDefaults(config, { imageTag: "v1.0.0" });

    this.deployment = new kplus.Deployment(
      this,
      nameFunction(prefix, "deployment"),
      {
        metadata: {
          namespace: namespace.name,
          labels: {
            ...labels,
            scope: prefix,
          },
        },
        replicas: 1,
        containers: [
          {
            name: "wordsmith-example-web",
            image: `ghcr.io/vbargl/wordsmith-web:${imageTag}`,
            envVariables: {
              API_ADDRESS: {
                value: apiComponent.address,
              },
            },
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

    this.service = utils.createService({
      self: this,
      namespace,
      deployment: this.deployment,
      prefix,
      nameFunction,
      labels: labels,
      port,
    });
  }

  get address(): string {
    return `${this.service.name}:${this.service.ports[0].port}`;
  }
}
