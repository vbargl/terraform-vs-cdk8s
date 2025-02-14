import * as kplus from "cdk8s-plus-28";
import * as configs from "../../defaults/configs";
import { Construct } from "constructs";
import { WordsmithDbComponent } from "./db";
import * as utils from "./utils";

export interface Config extends configs.Config {
  namespace: kplus.Namespace;
  imageTag?: string;
  dbComponent: WordsmithDbComponent;
}

export class WordsmithApiComponent extends Construct {
  readonly service: kplus.Service;
  private deployment: kplus.Deployment;

  constructor(scope: Construct, id: string, config: Config) {
    super(scope, id);

    const prefix = "wordsmith-api";
    const port = 8080;
    const {
      namespace,
      dbComponent,
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
            name: nameFunction(prefix, "container"),
            image: `ghcr.io/vbargl/wordsmith-api:${imageTag}`,
            envVariables: {
              DB_ADDRESS: {
                value: dbComponent.address,
              },
            },
            ports: [
              {
                name: "api",
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
