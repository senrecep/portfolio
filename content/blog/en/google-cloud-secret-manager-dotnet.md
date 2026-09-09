---
title: "Google Cloud Secret Manager Integration for Your .NET Applications"
description: "A .NET library for Google Cloud Secret Manager integration with features like prefix filtering, region-specific configuration, and JSON/raw secret support."
date: "2025-01-30"
slug: "google-cloud-secret-manager-dotnet"
mediumUrl: "https://senrecep.medium.com/google-cloud-secret-manager-integration-for-your-net-applications-84f2576f6027"
imageUrl: "/images/dotnet-secret-manager.webp"
keywords: ["Google Cloud Secret Manager", ".NET", "CSharpEssentials", "secrets management", "IConfiguration", "GCP", "microservices", "environment configuration"]
author: "Recep ŞEN"
modifiedDate: "2025-01-30"
category: "Tutorial"
faq:
  - q: "Why use Google Cloud Secret Manager instead of environment variables in .NET?"
    a: "Google Cloud Secret Manager provides centralized, auditable, and versioned secret storage that works seamlessly across multiple environments and microservices. Unlike environment variables, secrets can be rotated, access-controlled via IAM, and updated without redeploying applications."
  - q: "What is prefix-based filtering in CSharpEssentials.GcpSecretManager?"
    a: "Prefix filtering allows you to load only secrets whose names start with a specific prefix, such as your application name. This avoids loading unrelated secrets from a shared GCP project, improving startup performance and reducing unnecessary secret access."
  - q: "How does the library integrate with .NET's IConfiguration system?"
    a: "The library implements a custom IConfigurationProvider that pulls secrets from Google Cloud Secret Manager and exposes them through the standard IConfiguration interface. This means you can access secrets exactly like appsettings.json values using dependency injection and options patterns."
---

Every .NET developer eventually hits the same wall: you have API keys, database connection strings, and passwords scattered across `appsettings.json` files, environment variables, and maybe even hardcoded somewhere you would rather not admit. You know it is not sustainable. You know it is not secure. But wiring up a proper secrets management solution always feels like it should be simpler than it actually is.

I hit that wall while working on a microservice architecture running on Google Cloud. Google's own Secret Manager client library works fine on its own, but getting it to play nicely with .NET's `IConfiguration` system -- the thing your entire application already depends on for configuration -- was more friction than I wanted. Especially when you multiply that friction across multiple services, multiple environments, and multiple regions.

So I built a library to fix it. CSharpEssentials.GcpSecretManager bridges Google Cloud Secret Manager and .NET's configuration system so that secrets show up exactly like values from `appsettings.json`. No special access patterns, no custom service registrations -- just the standard `IConfiguration` interface your code already uses.

## What the Library Offers

The library focuses on the problems that actually come up in production. It provides seamless Google Cloud Secret Manager integration with .NET's `IConfiguration`, prefix-based filtering so each service only loads its own secrets, batch processing for performance when you have hundreds of secrets, region-specific configuration for latency-sensitive deployments, and support for both JSON-parsed and raw secret values.

## Getting Started

Install the NuGet package and you are ready to go:

```bash
dotnet add package CSharpEssentials.GcpSecretManager
```

## Usage Scenarios

The library supports several configurations depending on your architecture. Here are the most common ones.

### Simple Application

```csharp
builder.Configuration.AddGcpSecretManager();
```

```json
{
  "GoogleSecretManager": {
    "Projects": [
      {
        "ProjectId": "your-project-id"
      }
    ]
  }
}
```

This is the quickest path. You define the project ID in `appsettings.json`, call `AddGcpSecretManager()`, and every secret in that project becomes available through `IConfiguration`. It works well when you have a single application with a single GCP project and just want your secrets centralized without any ceremony.

### Microservice Architecture

```json
{
  "GoogleSecretManager": {
    "Projects": [
      {
        "ProjectId": "payment-service-prod",
        "PrefixFilters": [
          "payment_"
        ],
        "Region": "europe-west1"
      },
      {
        "ProjectId": "user-service-prod",
        "PrefixFilters": [
          "user_"
        ],
        "Region": "europe-west1"
      }
    ]
  }
}
```

In a microservice setup, you typically have separate GCP projects per service, and each service should only load the secrets it actually needs. Prefix-based filtering makes this clean: the payment service loads only `payment_*` secrets, the user service loads only `user_*` secrets. No accidental cross-contamination, and startup stays fast because you are not pulling in hundreds of irrelevant secrets.

### Multi-Region Application

```json
{
  "GoogleSecretManager": {
    "Projects": [
      {
        "ProjectId": "my-app-prod",
        "Region": "europe-west1",
        "PrefixFilters": [
          "eu_"
        ]
      },
      {
        "ProjectId": "my-app-prod",
        "Region": "us-central1",
        "PrefixFilters": [
          "us_"
        ]
      }
    ]
  }
}
```

When your application runs across regions and latency matters, you can point each deployment to the closest Secret Manager replica. The same project can be referenced multiple times with different regions and prefix filters, so your EU deployment pulls `eu_*` secrets from `europe-west1` while your US deployment pulls `us_*` secrets from `us-central1`.

### Development/Staging/Production

```csharp
builder.Configuration.AddGcpSecretManager(options =>
{
    options.BatchSize = 10;
    options.PageSize = 300;
    options.AddProject(new ProjectSecretConfiguration
    {
        ProjectId = "my-app-" + environment,
        PrefixFilters = [$"{environment}_"]
    });
});
```

This approach gives you programmatic control over the configuration. You can dynamically set the project ID and prefix based on the current environment, and tune performance parameters like `BatchSize` and `PageSize` for your specific workload. It fits naturally into CI/CD pipelines where the environment name drives everything.

### JSON and Raw Secrets

```json
{
  "GoogleSecretManager": {
    "Projects": [
      {
        "ProjectId": "my-app-prod",
        "SecretIds": [
          "app-config",
          "service-account",
          "ssl-cert"
        ],
        "PrefixFilters": [
          "app_",
          "creds_"
        ],
        "RawSecretIds": [
          "service-account",
          "ssl-cert"
        ],
        "RawSecretPrefixes": [
          "creds_"
        ]
      }
    ]
  }
}
```

By default, the library tries to parse secret values as JSON and flatten them into configuration keys. But not everything is JSON. Service account credential files, SSL/TLS certificates, SSH private keys, and PEM files are all stored as raw text. Marking them with `RawSecretIds` or `RawSecretPrefixes` tells the library to skip JSON parsing and store the value as-is.

One thing to keep in mind: secrets listed in `RawSecretIds` and `RawSecretPrefixes` must also appear in `SecretIds` or `PrefixFilters`. The raw flags control how a secret is parsed, not whether it is loaded.

## Performance Tips

There are a few levers you can pull to keep startup times low. Increase `BatchSize` (try 20) when you have many secrets, and increase `PageSize` (try 500) for large projects. Always specify `Region` to avoid unnecessary cross-region calls. Use `PrefixFilters` aggressively so you are only loading what you need. And for specific known secrets, `SecretIds` lets you skip the listing step entirely and fetch them directly.

## Security Tips

On the security side, use service accounts with minimal permissions -- `secretmanager.secretAccessor` is usually all you need. Create separate service accounts per environment so a compromised dev credential cannot read production secrets. Organize your secret names with environment-based prefixes (`prod_`, `staging_`, `dev_`) and service-based prefixes (`auth_`, `payment_`, `email_`) to keep things manageable as your secret count grows.

## Wrapping Up

CSharpEssentials.GcpSecretManager takes the friction out of using Google Cloud Secret Manager in .NET applications. Whether you are running a single web app or orchestrating dozens of microservices across regions, the configuration options scale with your architecture. The library is open source and actively maintained -- contributions and issue reports are welcome.

## Links

- [NuGet Package](https://www.nuget.org/packages/CSharpEssentials.GcpSecretManager)
- [GitHub - GcpSecretManager](https://github.com/SenRecep/CSharpEssentials/tree/main/CSharpEssentials.GcpSecretManager)
- [CSharpEssentials Library Family](https://github.com/SenRecep/CSharpEssentials)
- [All My NuGet Packages](https://www.nuget.org/profiles/recepsen)
