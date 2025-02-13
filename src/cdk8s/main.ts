import * as fs from "fs";
import { Construct } from "constructs";
import { App, Chart, ChartProps } from "cdk8s";
import {
  Deployment,
  Namespace,
  Service,
  ServiceType,
  DeploymentStrategy,
  PercentOrAbsolute,
  ConfigMap,
  Volume,
  ContainerSecurityContextProps,
  ContainerResources,
} from "cdk8s-plus-28";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const resources: ContainerResources = {
      cpu: {},
      memory: {},
    };

    const securityContext: ContainerSecurityContextProps = {
      ensureNonRoot: false,
      privileged: true,
      readOnlyRootFilesystem: false,
      allowPrivilegeEscalation: true,
    };

    const whoamiNamespace = new Namespace(this, "whoami-namespace", {
      metadata: {
        name: "whoami-example-app",
      },
    });

    const deployment = new Deployment(this, "whoami-example-deployment", {
      metadata: {
        namespace: whoamiNamespace.name,
        labels: {
          app: "whoami-example",
        },
      },
      replicas: 1,
      strategy: DeploymentStrategy.rollingUpdate({
        maxSurge: PercentOrAbsolute.absolute(1),
        maxUnavailable: PercentOrAbsolute.absolute(0),
      }),
      containers: [
        {
          name: "whoami-example",
          image: "docker.io/traefik/whoami:v1.10.4",
          ports: [
            {
              name: "web",
              number: 80,
            },
          ],
          securityContext,
          resources,
        },
      ],
    });

    new Service(this, "whoami-example-service", {
      metadata: {
        namespace: whoamiNamespace.name,
        labels: {
          app: "whoami-example",
        },
      },

      type: ServiceType.CLUSTER_IP,
      selector: deployment,
      ports: [
        {
          port: 80,
          targetPort: 80,
        },
      ],
    });

    const wordsmithNamespace = new Namespace(this, "wordsmith-example", {
      metadata: {
        name: "wordsmith-example-app",
      },
    });

    const wordsmithDbSchema = new ConfigMap(
      this,
      "wordsmith-example-db-schema-configmap",
      {
        metadata: {
          namespace: wordsmithNamespace.name,
          labels: {
            app: "wordsmith-example",
            scope: "wordsmith-db",
          },
        },
        data: {
          "schema.sql": fs
            .readFileSync("../_common/wordsmith-db/init.sql")
            .toString(),
        },
      },
    );

    const wordsmithDbVolume: Volume = Volume.fromConfigMap(
      this,
      "wordsmith-example-db-schema-volume",
      wordsmithDbSchema,
    );

    const wordsmithDbDeployment = new Deployment(
      this,
      "wordsmith-example-db-deployment",
      {
        metadata: {
          namespace: wordsmithNamespace.name,
          labels: {
            app: "wordsmith-example-db",
            scope: "wordsmith-db",
          },
        },

        replicas: 1,
        containers: [
          {
            name: "wordsmith-example-db",
            image: "postgres:10.0-alpine",
            ports: [
              {
                name: "postgres",
                number: 5432,
              },
            ],
            volumeMounts: [
              {
                volume: wordsmithDbVolume,
                path: "/docker-entrypoint-initdb.d",
              },
            ],
            securityContext,
            resources,
          },
        ],
      },
    );

    const wordsmithDbService = new Service(
      this,
      "wordsmith-example-db-service",
      {
        metadata: {
          namespace: wordsmithNamespace.name,
          labels: {
            app: "wordsmith-example",
            scope: "wordsmith-db",
          },
        },
        type: ServiceType.CLUSTER_IP,
        selector: wordsmithDbDeployment,
        ports: [
          {
            port: 5432,
            targetPort: 5432,
          },
        ],
      },
    );

    const wordsmithApiDeployment = new Deployment(
      this,
      "wordsmith-example-api-deployment",
      {
        metadata: {
          namespace: wordsmithNamespace.name,
          labels: {
            app: "wordsmith-example-api",
            scope: "wordsmith-api",
          },
        },
        replicas: 1,
        containers: [
          {
            name: "wordsmith-example-api",
            image: "ghcr.io/vbargl/wordsmith-api:v1.0.0",
            envVariables: {
              DB_ADDRESS: {
                value: `${wordsmithDbService.name}:${wordsmithDbService.ports[0].port}`,
              },
            },
            ports: [
              {
                name: "api",
                number: 8080,
              },
            ],
            securityContext,
            resources,
          },
        ],
      },
    );

    const wordsmithApiService = new Service(
      this,
      "wordsmith-example-api-service",
      {
        metadata: {
          namespace: wordsmithNamespace.name,
          labels: {
            app: "wordsmith-example",
            scope: "wordsmith-api",
          },
        },
        type: ServiceType.CLUSTER_IP,
        selector: wordsmithApiDeployment,
        ports: [
          {
            port: 8080,
            targetPort: 8080,
          },
        ],
      },
    );

    const wordsmithWebDeployment = new Deployment(
      this,
      "wordsmith-example-web-deployment",
      {
        metadata: {
          namespace: wordsmithNamespace.name,
          labels: {
            app: "wordsmith-example-web",
            scope: "wordsmith-web",
          },
        },
        replicas: 1,
        containers: [
          {
            name: "wordsmith-example-web",
            image: "ghcr.io/vbargl/wordsmith-web:v1.0.0",
            envVariables: {
              API_ADDRESS: {
                value: `${wordsmithApiService.name}:${wordsmithApiService.ports[0].port}`,
              },
            },
            ports: [
              {
                name: "web",
                number: 80,
              },
            ],
            securityContext,
            resources,
          },
        ],
      },
    );

    new Service(this, "wordsmith-example-web-service", {
      metadata: {
        namespace: wordsmithNamespace.name,
        labels: {
          app: "wordsmith-example",
          scope: "wordsmith-web",
        },
      },
      type: ServiceType.CLUSTER_IP,
      selector: wordsmithWebDeployment,
      ports: [
        {
          port: 80,
          targetPort: 80,
        },
      ],
    });
  }
}

const app = new App();
new MyChart(app, "cdk8s");
app.synth();
