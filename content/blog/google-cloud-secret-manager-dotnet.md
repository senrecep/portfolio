---
title: "Google Cloud Secret Manager Integration for Your .NET Applications"
description: "A .NET library for Google Cloud Secret Manager integration with features like prefix filtering, region-specific configuration, and JSON/raw secret support."
date: "2025-01-30"
slug: "google-cloud-secret-manager-dotnet"
mediumUrl: "https://senrecep.medium.com/google-cloud-secret-manager-integration-for-your-net-applications-84f2576f6027"
imageUrl: "/images/dotnet-secret-manager.webp"
---

Hello 👋

How do you manage sensitive information (API keys, database connection strings, passwords, etc.) in your .NET applications? Securely storing, configuring for different environments, and centrally managing this information has always been an important concern.

Today, I want to introduce you to the CSharpEssentials.GcpSecretManager library that I developed to solve this problem. This library allows you to seamlessly integrate Google Cloud Secret Manager into your .NET applications.


![](https://miro.medium.com/v2/resize:fit:700/1*oI7K_leu1aMPgbgSsicn1Q.png)

**Why Did I Develop This Library?**

While using Google Cloud Secret Manager in my .NET project, Google’s own library worked quite well, but integrating it with .NET’s configuration system (IConfiguration) was a bit cumbersome. Especially in microservice architecture or multi-environment (development, staging, production) scenarios, setting up and managing separate configurations for each service could become quite complex.

To solve this problem, I developed a package that makes Google Cloud Secret Manager easier to integrate with .NET’s configuration system and offers solutions suitable for different scenarios.

**What Does the Library Offer?**

\- 🔐 Google Cloud Secret Manager integration  
\- 🚀 Prefix-based filtering and custom secret ID support  
\- ⚡ Performance optimization with batch processing  
\- 🌍 Region-specific configuration  
\- 🎯 JSON parsing and raw secret support  
\- 📦 Easy integration with .NET configuration system (IConfiguration)

**How to Use?**

All you need to do to get started is install the NuGet package:

```
dotnet add package CSharpEssentials.GcpSecretManager
```

**Usage Scenarios**

The library supports various usage scenarios for different needs. Here are the most common scenarios and how to use them:

1.  **Simple Application Scenario**

```
builder.Configuration.AddGcpSecretManager();
```

```
{  "GoogleSecretManager": {    "Projects": [      {        "ProjectId": "your-project-id"      }    ]  }}
```

**When should you use it?**

\- You want to manage default configuration through \`appsettings.json\`  
\- You don’t need custom configuration code  
\- You want to centrally manage your secrets on Google Cloud  
\- You want quick integration

**2\. Microservice Architecture Scenario**

```
{  "GoogleSecretManager": {    "Projects": [      {        "ProjectId": "payment-service-prod",        "PrefixFilters": ["payment_"],        "Region": "europe-west1"      },      {        "ProjectId": "user-service-prod",        "PrefixFilters": ["user_"],        "Region": "europe-west1"      }    ]  }}
```

**When should you use it?**

\- You have a microservice architecture  
\- You use separate GCP projects for each service  
\- Some services share common secrets  
\- You use prefix-based service separation  
\- You want region-specific performance optimization

**3\. Multi-Region Application Scenario**

```
{  "GoogleSecretManager": {    "Projects": [      {        "ProjectId": "my-app-prod",        "Region": "europe-west1",        "PrefixFilters": ["eu_"]      },      {        "ProjectId": "my-app-prod",        "Region": "us-central1",        "PrefixFilters": ["us_"]      }    ]  }}
```

**When should you use it?**

\- Your application runs in different regions  
\- You have region-specific secrets  
\- Latency is critical  
\- You need separate configuration for each region  
\- You have high-performance requirements

**4\. Development/Staging/Production Scenario**

```
builder.Configuration.AddGcpSecretManager(options =>{    options.BatchSize = 10;    options.PageSize = 300;    options.AddProject(new ProjectSecretConfiguration    {        ProjectId = "my-app-" + environment,        PrefixFilters = [$"{environment}_"]    });});
```

**When should you use it?**

\- You use different secrets for different environments  
\- You have environment-based project separation  
\- You need environment-based configuration in your CI/CD pipeline  
\- You want to customize performance parameters

**5\. JSON and Raw Secret Scenario**

```
{  "GoogleSecretManager": {    "Projects": [      {        "ProjectId": "my-app-prod",        "SecretIds": ["app-config", "service-account", "ssl-cert"],        "PrefixFilters": ["app_", "creds_"],        "RawSecretIds": ["service-account", "ssl-cert"],        "RawSecretPrefixes": ["creds_"]      }    ]  }}
```

**What are RawSecretIds and RawSecretPrefixes for?**

This feature is particularly useful in these cases:

\- When storing cloud provider service account/credential files  
\- When storing SSL/TLS certificates  
\- When storing SSH private keys  
\- When storing PEM format files  
\- When storing custom configurations that are not in JSON format

**Important Note:**

Secrets specified in \`RawSecretIds\` and \`RawSecretPrefixes\` must also be defined in \`SecretIds\` or \`PrefixFilters\`.

**Performance Tips**

Here are some points to consider for using the library most efficiently:

1.  **Batch and Page Size Optimization:  
    **\- Increase \`BatchSize\` for many secrets (e.g., 20)  
    \- Increase \`PageSize\` for large projects (e.g., 500)  
    \- Always specify \`Region\`
2.  **Secret Filtering:  
    **\- Use \`PrefixFilters\` to filter unnecessary secrets  
    \- Use \`SecretIds\` for specific secrets  
    \- Use \`RawSecretIds\` for secrets that are not in JSON format or JSON secrets that you don’t want to be parsed
3.  **Region Optimization:  
    **\- Specify appropriate region for each project  
    \- Use separate project configuration for each region in multi-region applications

**Security Tips**

Here are some recommended best practices for managing your secrets securely:

1.  **Service Account Management:  
    **\- Use service accounts with minimal permissions  
    \- Create separate service accounts for each environment  
    \- Store credentials files securely
2.  **Secret Organization:  
    **\- Use environment-based prefixes: \`prod\_\`, \`staging\_\`, \`dev\_\`  
    \- Use service-based prefixes: \`auth\_\`, \`payment\_\`, \`email\_\`  
    \- Use special prefixes for sensitive secrets

**Conclusion**

CSharpEssentials.GcpSecretManager enables you to use Google Cloud Secret Manager in your .NET projects securely, performantly, and flexibly. Whether it’s a simple web application or a complex microservice architecture — it offers suitable configuration options for every scenario.

The library is designed to meet the needs of modern .NET applications and continues to evolve. I believe it has features that can meet your needs as well.

**Useful Links**

\- 📦 [NuGet Package](https://www.nuget.org/packages/CSharpEssentials.GcpSecretManager)

\- 💻 [GitHub — GcpSecretManager](https://github.com/SenRecep/CSharpEssentials/tree/main/CSharpEssentials.GcpSecretManager)

\- 🔍 [CSharpEssentials Library Family](https://github.com/SenRecep/CSharpEssentials)

\- 📚 [All My NuGet Packages](https://www.nuget.org/profiles/recepsen)

I’ve shared the project as open source on GitHub. You can examine the source code, fork the project if you want to contribute, and send pull requests. If you encounter any problems or have feature suggestions, you can open an issue on GitHub. If you want to try it and provide feedback, I’m looking forward to your comments!