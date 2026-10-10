import { addBanner } from "../states/banners";

export function show(): void {
  // Called once when the app is ready, so navigation never rerolls it.
  if (Math.random() < 0.05) {
    addBanner({
      level: "success",
      text: "vax is the goat",
    });
  }
}
