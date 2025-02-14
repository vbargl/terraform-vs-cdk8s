import * as fs from "fs";
import * as kplus from "cdk8s-plus-28";
import * as configs from "../../defaults/configs";
import { Construct } from "constructs";
import { createService } from "./utils";

export interface Config extends configs.Config {
  namespace: kplus.Namespace;
}

export class WordsmithDbComponent extends Construct {
  readonly service: kplus.Service;
  private deployment: kplus.Deployment;
  private schema: kplus.ConfigMap;
  private volume: kplus.Volume;

  constructor(scope: Construct, id: string, config: Config) {
    super(scope, id);

    const prefix = "wordsmith-db";
    const port = 5432;
    const { namespace, nameFunction, labels, resources, securityContext } =
      configs.WithDefaults(config);

    this.schema = new kplus.ConfigMap(
      this,
      nameFunction(`${prefix}-schema`, "configmap"),
      {
        metadata: {
          namespace: namespace.name,
          labels: {
            ...labels,
            scope: prefix,
          },
        },
        data: {
          "schema.sql": fs
            .readFileSync("../_common/wordsmith-db/init.sql")
            .toString(),
        },
      },
    );

    this.volume = kplus.Volume.fromConfigMap(
      this,
      nameFunction(`${prefix}-schema`, "volume"),
      this.schema,
    );

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
            image: "postgres:10.0-alpine",
            ports: [
              {
                name: "postgres",
                number: port,
              },
            ],
            volumeMounts: [
              {
                volume: this.volume,
                path: "/docker-entrypoint-initdb.d",
              },
            ],
            securityContext,
            resources,
          },
        ],
      },
    );

    this.service = createService({
      self: this,
      namespace,
      deployment: this.deployment,
      prefix,
      nameFunction,
      labels,
      port,
    });
  }

  get address(): string {
    return `${this.service.name}:${this.service.ports[0].port}`;
  }
}
