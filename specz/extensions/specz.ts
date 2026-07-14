import { readFileSync } from "node:fs";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

interface ReminderPayload {
  hookSpecificOutput?: {
    additionalContext?: unknown;
  };
}

function loadReminder(): string {
  const path = new URL("../SPECZ_REMINDER.json", import.meta.url);
  const payload = JSON.parse(readFileSync(path, "utf8")) as ReminderPayload;
  const reminder = payload.hookSpecificOutput?.additionalContext;

  if (typeof reminder !== "string" || reminder.length === 0) {
    throw new Error("Specz reminder is missing or invalid");
  }

  return reminder;
}

const reminder = loadReminder();

export default function speczExtension(pi: ExtensionAPI): void {
  pi.on("before_agent_start", (event) => {
    if (event.systemPrompt.includes(reminder)) {
      return;
    }

    return {
      systemPrompt: `${event.systemPrompt}\n\n${reminder}`,
    };
  });
}
