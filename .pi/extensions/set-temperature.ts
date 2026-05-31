import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("before_provider_request", (event) => {
    return { ...event.payload, temperature: 0.1 };
  });
}
