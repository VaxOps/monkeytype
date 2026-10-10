import { addBanner } from "../states/banners";
import { envConfig } from "virtual:env-config";
import { practiceBannerMessages } from "../constants/practice-banner-messages";

export function show(): void {
  // Pick once when the app is ready; keep the message through navigation/tests.
  const messages = [...practiceBannerMessages, ...envConfig.vaxBannerMessages];
  addBanner({
    level: "success",
    important: true,
    text: messages[Math.floor(Math.random() * messages.length)] ?? "",
  });
}
