import { Plugin } from "vite";
import { EnvConfig } from "virtual:env-config";

const virtualModuleId = "virtual:env-config";
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

const defaultVaxBannerMessages = [
  "vax types faster than his shadow.",
  "the spacebar works overtime for vax.",
  "vax called. your keyboard wants a rematch.",
  "somewhere, vax just broke the sound barrier.",
  "this keyboard has been blessed by vax.",
];

export function parseVaxBannerMessages(value: string | undefined): string[] {
  if (value === undefined || value.trim() === "") {
    return [...defaultVaxBannerMessages];
  }
  let messages: unknown;
  try {
    messages = JSON.parse(value);
  } catch {
    throw new Error(
      "VAX_BANNER_MESSAGES must be a JSON array of nonempty strings",
    );
  }
  if (
    !Array.isArray(messages) ||
    !messages.every(
      (message: unknown) =>
        typeof message === "string" && message.trim() !== "",
    )
  ) {
    throw new Error(
      "VAX_BANNER_MESSAGES must be a JSON array of nonempty strings",
    );
  }
  return (messages as string[]).map((message) => message.trim());
}

function fallback(value: string | undefined | null, fallback: string): string {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
}

export function envConfig(options: {
  isDevelopment: boolean;
  clientVersion: string;
  env: Record<string, string>;
}): Plugin {
  const vaxBannerMessages = parseVaxBannerMessages(
    options.env["VAX_BANNER_MESSAGES"],
  );
  return {
    name: "virtual-env-config",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        if (options.env["AUTH_PROVIDER"] !== "local") return html;
        return html
          .replace(
            /<script\s+src="https:\/\/www\.google\.com\/recaptcha\/api\.js\?render=explicit"[\s\S]*?<\/script>/g,
            "",
          )
          .replace(/<link[^>]*rel="preconnect"[^>]*>/g, "");
      },
    },
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
      return;
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const devConfig: EnvConfig = {
          isDevelopment: true,
          vaxBannerMessages,
          authProvider:
            options.env["AUTH_PROVIDER"] === "local" ? "local" : "firebase",
          backendUrl: fallback(
            options.env["BACKEND_URL"],
            "http://localhost:5005",
          ),
          clientVersion: options.clientVersion,
          recaptchaSiteKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
          quickLoginEmail: options.env["QUICK_LOGIN_EMAIL"],
          quickLoginPassword: options.env["QUICK_LOGIN_PASSWORD"],
        };

        const prodConfig: EnvConfig = {
          isDevelopment: false,
          vaxBannerMessages,
          authProvider:
            options.env["AUTH_PROVIDER"] === "local" ? "local" : "firebase",
          backendUrl: fallback(
            options.env["BACKEND_URL"],
            "https://api.monkeytype.com",
          ),
          recaptchaSiteKey: options.env["RECAPTCHA_SITE_KEY"] ?? "",
          quickLoginEmail: undefined,
          quickLoginPassword: undefined,
          clientVersion: options.clientVersion,
        };

        const envConfig = options.isDevelopment ? devConfig : prodConfig;
        return `
          export const envConfig = ${JSON.stringify(envConfig)};
        `;
      }
      return;
    },
  };
}
