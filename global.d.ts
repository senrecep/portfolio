declare module "*.jpg" {
  const content: import("next/image").StaticImageData;
  export default content;
}

declare module "*.png" {
  const content: import("next/image").StaticImageData;
  export default content;
}

declare module "*.svg" {
  const content: import("next/image").StaticImageData;
  export default content;
}

declare module "@microsoft/clarity" {
  interface ClarityAPI {
    init(projectId: string): void;
    identify(userId: string, sessionId?: string, pageId?: string, userHint?: string): void;
    consent(): void;
    upgrade(reason: string): void;
    event(name: string): void;
    set(key: string, value: string): void;
  }
  
  const clarity: ClarityAPI;
  export default clarity;
}

