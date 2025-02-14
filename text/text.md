---
Title: A Comparison of Tools to Provision Infrastructure in kubernetes%3A Terraform vs CDK8S
Author: Vojtěch Bargl
Abstract: // TODO
Keywords: terraform, CDK8s, kubernetes, infrastructure as code
---

# Introduction

Organizations are currently facing the challenge of effectively managing their infrastructure in the current fast-changing IT environment. Infrastructure as Code (IaC) has become a common practice for defining, deploying, and managing the infrastructure using code rather than configuring it manually. IaC improves efficiency, scalability, and reliability through automation of the setup and configuration process. It treats infrastructure the same as application code, hence ensuring consistency, reducing the chances of human error and improving on the operations. IaC is integral to the modern DevOps culture, and therefore, strong and effective tools are required to define and manage the infrastructure configurations efficiently.

Kubernetes is a strong platform for running, scaling, and operating containerised applications, but declaring the infrastructure to manage it can be complicated. To this end, organizations adopt tools like Terraform or CDK8s (Cloud Development Kit for Kubernetes) to help simplify the management of the Kubernetes infrastructure while complying with the IaC paradigm.

Terraform is one of the most popular tools used in the IaC domain today and is known for being versatile and having a wide range of ecosystems. It uses a declarative approach to allow users to define the infrastructure of an application on multiple cloud providers. Terraform provides a way to describe Kubernetes infrastructure along with other cloud resources using HCL (HashiCorp Language), thus making it suitable for managing multi-cloud and hybrid environments.

On the other hand, CDK8s, an open-source product developed by AWS, enables the developers to write Kubernetes manifests in popular programming languages like TypeScript, Python, and Go, thus offering a more codified and extensible solution for defining Kubernetes configuration.

The purpose of this study is to compare Terraform and CDK8s, and identify the similarities and differences between the two. It will also compare their effects on scalability, maintainability, and feature sets, which will assist organizations in identifying the most suitable tool for their Kubernetes infrastructure structure.

## Research objectives

To provide a clear direction for this research, the following key questions will be explored, focusing on the comparative aspects of Terraform and CDK8s:

1. What are key differences, similarities and limitations between Terraform and CDK8s?
2. What are the scalability and maintenance challenges of using Terraform and CDK8s?
3. What advantages and trade-offs in terms of flexibility, extensibility, and ecosystem support exist in the feature sets of Terraform and CDK8s?

# Literature Review

Terraform is a subject of a lot of studies. For example, Reza Faezi in his 2024 thesis examines the transition from Terraform to OpenTofu, highlighting that while both tools share foundational elements, the primary difference lies in their licensing: OpenTofu is entirely open source, unlike Terraform's new Business Source License (BSL). The study identifies migration challenges, such as dependency management and compatibility issues, and outlines strategies to address them, recommending a careful, incremental migration approach and emphasizing the importance of comprehensive testing and stakeholder engagement.\[lit-1\]

Another example can be the 2024 study by Frois and others in which they conduct a comparative analysis of Terraform and AWS Cloud Development Kit (CDK) in managing Infrastructure as Code (IaC). They evaluate both tools across four key aspects: abstraction capability, scalability, maintainability, and performance. The findings suggest that Terraform is better suited for experienced teams seeking rapid implementations, while AWS CDK is more appropriate for less experienced teams prioritizing resource efficiency during implementation. The study emphasizes the importance of selecting the appropriate tool based on the specific needs and expertise of the development team.\[lit-2\]

In a 2024 study, Venkat Marella explores the integration of DevOps methodologies with cloud management to enhance operational efficiency and agility in IT systems. The research provides a comprehensive overview of essential DevOps tools and technologies for managing cloud infrastructure, including monitoring systems, CI/CD pipelines, Infrastructure as Code (IaC) tools, and configuration management systems. A key focus is on addressing the limitations of current DevOps systems, such as the inability to support concurrent project development and deployment on shared operational infrastructure. The study proposes solutions to these challenges within Amazon Web Services (AWS) environments, aiming to improve deployment efficiency, reliability in software and infrastructure delivery, and security. Additionally, Marella presents a mathematical model to determine the optimal configuration for IT infrastructure, emphasizing the automation, scaling, and management of Kubernetes clusters using Terraform as an IaC tool. The paper highlights the benefits of using Terraform, including increased productivity, automation, scalability, and security, and compares its capabilities with other popular IaC tools and techniques. Furthermore, it examines how Terraform integrates with AWS services to streamline processes and reduce complexity, discussing trends and potential developments in combining Kubernetes and Terraform to enhance the management of cloud-native applications.\[lit-3\]

In a 2018 study, Rahman and others conduct a comprehensive analysis of Infrastructure as Code (IaC) scripts, focusing on the prevalence and characteristics of code smells within these scripts. The research reveals that code smells are common in IaC scripts and can lead to maintenance challenges and potential security vulnerabilities. The authors emphasize the importance of adhering to coding best practices and implementing regular code reviews to mitigate these issues, thereby enhancing the quality and reliability of infrastructure automation.\[lit-4\]

In the article "Simplifying your Kubernetes infrastructure with CDK8s," Shyam Mohan discusses how CDK8s transforms Kubernetes configuration into a developer-friendly experience by allowing the definition of Kubernetes applications using familiar programming languages like TypeScript, Python, or Java. This approach enhances type safety, code validation, and integrates seamlessly with Continuous Integration and Continuous Deployment (CI/CD) pipelines, thereby streamlining deployment workflows and improving maintainability. The article also explores real-world applications of CDK8s, such as orchestrating microservices architectures and managing stateful applications with persistent volumes.\[lit-5\]

## Research gap

While both Terraform and CDK8s are widely used for infrastructure automation, there is a notable gap in comparative research analyzing their efficiency, scalability, and best use cases in Kubernetes environments. Existing studies primarily focus on Terraform’s declarative approach and its cloud-agnostic capabilities, while CDK8s is often discussed in the context of simplifying Kubernetes configurations using general-purpose programming languages. However, a direct, in-depth comparison of their real-world adoption for Kubernetes infrastructure remains largely unexplored. This gap highlights the need for further research to evaluate their strengths and limitations side by side, providing insights into their suitability for different operational requirements which this study aims to fill.

# Methodology

This study employs a combination of structured methods and case studies to systematically analyze and compare the tools, ensuring a comprehensive evaluation that directly addresses the research questions. The methods used include incremental and cumulative change tracking, execution duration measurement, web crawling for documentation analysis, and rollback complexity assessment and feature set comparison, each providing quantitative and qualitative insights into different aspects of tool performance and usability. Additionally, case studies offer well-rounded validation by demonstrating how each tool functions in practical deployment scenarios. By integrating these approaches, the study ensures an objective and data-driven assessment, contributing directly to answering the research questions.

## Tools

To ensure a consistent comparison of these tools under identical conditions, supplementary tools were utilized or developed to facilitate the evaluation process. One such tool was related to Kubernetes, an industry-standard container orchestration platform widely used for automating the deployment, scaling, and management of containerized applications.

### Kubernetes

Kubernetes is an open-source platform that automates the deployment, scaling, and management of containerized applications, streamlining operations for DevOps teams. Its architecture is based on a client-server model, comprising a control plane (master node) and worker nodes. The control plane manages the desired state of the cluster, while worker nodes run the actual applications. Key components include the API server, which processes REST requests; etcd, a distributed key-value store for configuration data; the scheduler, which assigns pods to nodes; and various controllers that maintain the cluster's desired state. Understanding these components and their interactions is crucial for effectively leveraging Kubernetes' capabilities.\[k8s-1\]\[k8s-2\]

Kubernetes has become the de facto standard for container orchestration in enterprise environments due to its scalability, flexibility, and robust automation capabilities. Organizations leverage Kubernetes to manage microservices architectures, ensure high availability, and streamline DevOps workflows. It enables businesses to efficiently deploy workloads across hybrid and multi-cloud environments, reducing operational overhead while improving system reliability.\[k8s-5\]

Various Kubernetes distributions cater to different use cases, from large-scale production clusters to lightweight development environments. Among them:

- **Minikube** – A local Kubernetes solution often used for development and testing purposes. It allows developers to run a single-node Kubernetes cluster on a local machine, making it an ideal choice for prototyping and debugging Kubernetes applications. Minikube is a lightweight tool that enables developers to run a single-node Kubernetes cluster locally for testing and development. It supports various hypervisors and container runtimes, making it easy to simulate Kubernetes environments without requiring a full cloud setup.\[k8s-6\] Minikube is ideal for experimenting with Kubernetes features, testing deployments, and learning cluster management in a simple, resource-efficient way.\[k8s-3\]
- **k0s** – Alternative to Minikube is k0s, which is a lightweight, all-in-one Kubernetes distribution that simplifies cluster deployment and management by eliminating external dependencies.\[k8s-3\] A lightweight, single-binary Kubernetes distribution designed for small clusters and edge computing scenarios. It simplifies deployment by reducing dependencies while maintaining full Kubernetes compatibility.\[k8s-4\]

Minikube was utilized in this study as the Kubernetes environment for testing and evaluation.

### Linux commands

wc, awk, sed, time, html2markdown, git, tree-sitter

### Web crawler

## Methods

1. Web crawling \- A custom web crawler is used to extract relevant textual content while filtering out non-essential HTML elements. To eliminate unnecessary data that does not contribute meaningful information, the extracted text is converted into Markdown format. Common repetitive elements such as menus, headers, and footers \- which provide minimal informational value but could skew the final dataset \- were reduced to a single occurrence. In the refined dataset, all words were systematically counted to quantify the breadth and comprehensiveness of the provided information.
2. Incremental changes \- the version control system Git is utilized to measure the extent of modifications needed to reach the desired outcome. As a widely adopted tool in the enterprise environment, Git provides a robust mechanism for tracking changes and enabling the quantification of modifications in numerical terms. This makes it an effective choice for assessing the complexity and effort required for each step in the process.
3. Cumulative changes \- the syntax parsing tool Tree-Sitter is employed to quantify the overall extent of modifications by analyzing the final state of all accumulated changes. This approach provided a structured and precise measurement of the total transformations made throughout the process. Tree-Sitter is chosen for its multi-language support, ensuring a consistent measurement across different programming languages. By parsing each file into a structured set of tokens, with each token represented on a separate line, the cumulative changes were quantified as the total number of lines across all modified files. This approach provided a uniform and comparable metric for evaluating the extent of changes in each outcome.
4. Execution duration \- the time required for an execution to complete is measured to assess its efficiency of each outcome. This metric provides a practical evaluation of how execution time is affected by given changes. By systematically tracking execution duration, a quantitative comparison is made between different operations, allowing for an objective assessment of their speed and efficiency in real-world scenarios.

## Case studies

1. The first case study focuses on comparing the structure and workflow of Terraform and CDK8s by implementing a Kubernetes deployment using both tools. This study aims to provide a high-level understanding of each tool’s approach, examining how they define infrastructure and execute deployments.
2. Tool initialization aims to provide a clearer understanding of the complexity associated with the initialization and configuration of each tool, offering a more detailed perspective on the setup process. To achieve this, two key methods were employed: incremental changes and cumulative changes. This analysis directly contributes to answering Research Questions RQ1 and RQ2.
3. Application addition helps clarify the extent of changes required to achieve desired outcome of adding application into Kubernetes. Methods used in this case study are: incremental changes and cumulative change. This analysis directly contributes to answering Research Question RQ2.
4. Extensibility and modularity assess the ability of each tool to adapt to new requirements and integrate additional functionalities. This is evaluated by analyzing the structure and flexibility of the tool’s components, measuring the effort required to extend or modify its functionality. Methods used for this case study are incremental changes and cumulative changes. This approach contributes directly to answering Research Question RQ2.
5. Documentation analysis provides insight into the completeness and depth of the information available for each tool. A web crawler method is used to collect data for this case study which contributes directly to answering Research Question RQ2.
6. Execution duration of applying changes provides a measurable assessment of the time required for modifications to take effect. This is evaluated by tracking the execution duration of relevant operations under controlled conditions. This contributes directly to answering Research Questions RQ1 and RQ2.
7. Rollback complexity evaluates the effort required to revert changes and restore the system to a previous stable state. This is measured by analyzing the number of steps, commands, and manual interventions needed to achieve a successful rollback. This approach provides insights into the efficiency of error recovery mechanisms and contributes directly to answering Research Questions RQ1 and RQ2.
8. Testability
9. Licensing, Contribution and Popularity

# Comparison results and interpretation

## Structure and Workflow

Terraform utilizes HashiCorp Configuration Language (HCL), which follows a declarative paradigm to define the desired infrastructure state. Unlike traditional programming languages, it lacks explicit control flow directives but allows looping and conditional logic through built-in properties available to all resources. Terraform's execution process occurs in two distinct phases: (1) Plan, where the tool compares the current state with the desired state and generates a set of optimized changes to be applied, and (2) Apply, which executes these changes directly on the Kubernetes cluster in a fault-tolerant manner. Fault tolerance in this context means that if a specific change fails, dependent changes are not executed, whereas independent changes continue to be applied. Changes that are successfully implemented are recorded, ensuring that they are not reapplied in subsequent executions.

In contrast, CDK8s adheres to the programming paradigm of the language in which it is implemented, defining infrastructure as a series of sequential instructions required to reach the desired state. Unlike Terraform, CDK8s is specifically designed for Kubernetes environments and its sole purpose is to generate Kubernetes manifests in YAML format. These manifests, which may consist of one or multiple YAML files, must then be applied to the Kubernetes cluster manually or through an external automation tool.

It is important to note that Kubernetes itself is inherently declarative, meaning that both Terraform and CDK8s ultimately rely on declarative principles to apply changes. However, a key difference lies in how these tools handle change ordering. Terraform explicitly determines and optimizes the order of resource application, ensuring dependencies are managed internally, whereas CDK8s defers this responsibility to Kubernetes, allowing the platform to handle the execution order of applied changes.

## Tool initialization

cdk8s dokáže pracovat se 4 programovacími jazyky. Pro tuto studii jsem vybral typescript, protože cdk8s u všech jazyků na pozadí využívá typescriptovou implementaci jsii.

Terraform changed-lines: 30
Terraform tokens-count: 164
CDK8s changed-lines: 33357
CDK8s tokens-count: 177402

## Application addition

> TODO: CDK8s cannot remove resources

Terraform changed-lines: 321
Terraform tokens-count: 1580 (+1416)
cdk8s changed lines: 274
cdk8s tree-sitter tokens: 177456 (+54)

## Extensibility and modularity

Terraform achieves modularity through its module system, which enables the encapsulation of commonly used infrastructure resources into reusable components. A module acts as a self-contained unit that accepts input parameters and produces outputs, which can be scalars (integers, strings), arrays, objects, or even arrays of objects. One limitation observed is that default values defined within modules can only be overridden by consumers, restricting flexibility in dynamic naming conventions. This constraint often necessitates very complex workarounds.

In contrast, CDK8s modularity is inherently based on standard programming practices, allowing developers to write modular code using classes, functions, and abstractions within their chosen programming language. Creating reusable components in CDK8s is as straightforward as defining a class or function that encapsulates a specific configuration, offering a flexible and intuitive approach to modular infrastructure management.

Terraform changed-lines: 758
Terraform tokens-count: 2390 (+810)
cdk8s changed-lines: 793
cdk8s tree-sitter tokens: 179695 (+2239)

## Documentation

Terraform provides extensive documentation through two primary sources: the Terraform official documentation (developer.hashicorp.com/terraform) and the Terraform Kubernetes provider documentation (registry.terraform.io/providers/hashicorp/kubernetes/latest/docs). Since Terraform interacts with multiple cloud and infrastructure providers, users must reference both general Terraform documentation and provider-specific documentation to fully understand its capabilities. This two-layered approach ensures comprehensive coverage but may require additional effort to navigate when managing Kubernetes resources.

Number reported by content.sh tool: 2138979

CDK8s offers centralized and structured documentation at cdk8s.io/docs/latest, providing guidance on installation, API references, and best practices for defining Kubernetes manifests using supported programming languages. The documentation is concise and developer-friendly, focusing primarily on writing infrastructure as code rather than deep operational insights. While comprehensive for its purpose, CDK8s documentation is less extensive compared to Terraform due to its narrower scope and Kubernetes-only focus.

Number reported by content.sh tool: 80090

## Rollback complexity

terraform:
git revert <commits> / git reset --hard <commit>
terraform plan+apply

cdk8s:
not easily achievable by default

It would require either:

- to track applied resources in inventory
- applied resources with revision annotation.
  then applied rollback and delete remnants found by specific revision annotation.

## Testability

Terraform offers robust testability through various mechanisms that ensure infrastructure configurations are validated before deployment. The terraform plan command provides a built-in preview of infrastructure changes, allowing users to identify unintended modifications before applying them. Additionally, Terraform supports unit and integration testing through third-party tools such as Terratest, which enables automated validation of infrastructure by provisioning real cloud resources and running assertions against them. Terraform lacks traditional unit testing capabilities, relying instead on integration and acceptance testing to validate infrastructure correctness. This makes Terraform suitable for end-to-end infrastructure verification, however, due to Terraform’s reliance on external cloud services, testing often requires a sandboxed environment or mocking strategies to avoid unintended costs and resource modifications.

CDK8s enhances testability by leveraging the capabilities of general-purpose programming languages. Unlike traditional Kubernetes manifest files written in YAML, CDK8s allows for unit testing of infrastructure logic using standard software testing frameworks like Jest (for TypeScript) or Pytest (for Python). This enables developers to validate infrastructure constructs without deploying them to a live cluster. Additionally, CDK8s supports snapshot testing, where generated YAML manifests are compared against predefined templates to detect unintended changes. However, since CDK8s ultimately outputs YAML manifests that require manual or external validation within a Kubernetes environment, testing applied changes requires additional tools such as Kubernetes-native testing frameworks (e.g., KubeTest, Kuttl) or integration tests with live clusters. This makes CDK8s highly testable in terms of infrastructure logic validation, but testing its real-world application requires additional deployment and verification steps.

## Licensing, Contribution and Popularity

Terraform is an open-source infrastructure-as-code tool originally licensed under MPL 2.0 but transitioned to BSL 1.1 in 2023, introducing restrictions on commercial usage. This change led to the development of OpenTofu, a fully open-source alternative. Despite licensing concerns, Terraform remains highly popular in enterprise environments, with extensive multi-cloud support and a large contributor base. However, the shift in licensing may impact future community-driven contributions.

CDK8s is an open-source framework developed by AWS, licensed under the Apache License 2.0, which allows unrestricted use, modification, and distribution. It has a growing but smaller community compared to Terraform, with contributions primarily from AWS and open-source developers. While CDK8s is gaining traction, its adoption remains niche, mainly among Kubernetes-focused teams looking for a programmatic approach to manifest generation.

# Conclusion

# References and Citations

1. [https://www.theseus.fi/bitstream/handle/10024/872029/Faezi_Reza.pdf](https://www.theseus.fi/bitstream/handle/10024/872029/Faezi_Reza.pdf)
2. [https://sol.sbc.org.br/index.php/sbes/article/view/30404/30210](https://sol.sbc.org.br/index.php/sbes/article/view/30404/30210)
3. [https://www.researchgate.net/publication/387028328_Optimizing_DevOps_Pipelines_with_Automation_Ansible_and_Terraform_in_AWS_Environments](https://www.researchgate.net/publication/387028328_Optimizing_DevOps_Pipelines_with_Automation_Ansible_and_Terraform_in_AWS_Environments)
4. [https://www.sciencedirect.com/science/article/pii/S0950584918302507](https://www.sciencedirect.com/science/article/pii/S0950584918302507)
5. [https://razorops.com/blog/simplifying-kubernetes-infrastructure-with-cdk8s](https://razorops.com/blog/simplifying-kubernetes-infrastructure-with-cdk8s)
6. [https://enterprisersproject.com/article/2020/4/kubernetes-everything-you-need-know](https://enterprisersproject.com/article/2020/4/kubernetes-everything-you-need-know)
7. [https://enterprisersproject.com/article/2020/4/kubernetes-architecture-beginners](https://enterprisersproject.com/article/2020/4/kubernetes-architecture-beginners)
8. [https://minikube.sigs.k8s.io/docs/start/](https://minikube.sigs.k8s.io/docs/start/)
9. [https://k0sproject.io/](https://k0sproject.io/)
10. [https://dl.acm.org/doi/pdf/10.1145/2890784](https://dl.acm.org/doi/pdf/10.1145/2890784)
11. [https://kubernetes.io/docs/tasks/tools/install-minikube/](https://kubernetes.io/docs/tasks/tools/install-minikube/)
12. [https://www.oreilly.com/radar/an-introduction-to-immutable-infrastructure/](https://www.oreilly.com/radar/an-introduction-to-immutable-infrastructure/)
13. [https://zdrojak.cz/clanky/infrastructure-as-code-lehky-uvod/](https://zdrojak.cz/clanky/infrastructure-as-code-lehky-uvod/)
14. [https://aws.amazon.com/what-is/iac/](https://aws.amazon.com/what-is/iac/)
15. [https://arxiv.org/pdf/2205.10676](https://arxiv.org/pdf/2205.10676)
16. [https://cdk8s.io/docs/latest/](https://cdk8s.io/docs/latest/)
