import type { infer as Infer } from "zod";
import type { runAutopilotSchema } from "../schemas/autopilot.js";

export type RunAutopilotRequest = Infer<typeof runAutopilotSchema>;
