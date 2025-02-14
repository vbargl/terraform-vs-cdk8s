import * as kplus from "cdk8s-plus-28";
import * as configs from "../../defaults/configs";
import { Construct } from "constructs";
import { WordsmithDbComponent } from "./db";
import { WordsmithApiComponent } from "./api";
import { WordsmithWebComponent } from "./web";

export interface Config extends configs.Config {
  webImageTag?: string;
  apiImageTag?: string;
}

export class WordsmithApp extends Construct {
  private db: WordsmithDbComponent;
  private api: WordsmithApiComponent;
  private web: WordsmithWebComponent;

  constructor(scope: Construct, id: string, config: Config) {
    super(scope, id);

    const prefix = "wordsmith";
    const { nameFunction, apiImageTag, webImageTag } = configs.WithDefaults(
      config,
      {
        apiImageTag: "v1.0.0",
        webImageTag: "v1.0.0",
      },
    );

    const namespace = new kplus.Namespace(
      this,
      nameFunction(prefix, "namespace"),
    );

    this.db = new WordsmithDbComponent(
      this,
      nameFunction("wordsmith-db", "component"),
      {
        ...config,
        namespace,
      },
    );

    this.api = new WordsmithApiComponent(
      this,
      nameFunction("wordsmith-api", "component"),
      {
        ...config,
        namespace,
        dbComponent: this.db,
        imageTag: apiImageTag,
      },
    );

    this.web = new WordsmithWebComponent(
      this,
      nameFunction("wordsmith-web", "component"),
      {
        ...config,
        namespace,
        apiComponent: this.api,
        imageTag: webImageTag,
      },
    );
  }

  get apiAddress(): string {
    return this.api.address;
  }

  get webAddress(): string {
    return this.web.address;
  }
}
