import { Interaction, Client, RateLimitData } from "discord.js";
import { Properties } from "./properties.js";

export interface PlootEvent {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => Promise<void>;
}