import { Construct } from "constructs";
import { App, Chart, ChartProps } from "cdk8s";
import { WhoamiApp } from "./apps/whoami";
import { WordsmithApp } from "./apps/wordsmith";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    new WhoamiApp(this, "whoami-example", {
      labels: {
        app: "whoami-example",
      },
    });

    new WordsmithApp(this, "wordsmith-example", {
      labels: {
        app: "wordsmith-example",
      },
    });
  }
}

const app = new App();
new MyChart(app, "cdk8s");
app.synth();
