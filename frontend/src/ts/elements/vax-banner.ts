import { addBanner } from "../states/banners";
import { envConfig } from "virtual:env-config";

export function show(): void {
  // Called once when the app is ready, so navigation never rerolls it.
  const messages = envConfig.vaxBannerMessages;
  if (messages.length > 0 && Math.random() < 0.1) {
    addBanner({
      level: "success",
      text: messages[Math.floor(Math.random() * messages.length)] ?? "",
    });
  }
}
