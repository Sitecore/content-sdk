declare namespace NodeJS {
  export interface Global {
    [key: string]: unknown;
    requestAnimationFrame: (callback: () => void) => void;
    window: Window;
    document: Document;
    navigator: Navigator;
    HTMLElement: HTMLElement;
  }
}

declare module 'http' {
  interface IncomingHttpHeaders {
    'x-forwarded-host'?: string | undefined;
  }
}

declare module '@tailwindcss/node' {
  export interface Compiler {
    build(classes: string[]): string;
  }
  export function compile(
    css: string,
    options: { base: string; onDependency: (path: string) => void }
  ): Promise<Compiler>;
}
