import PlayerEvent from "../models/PlayerEvent";
import AdminEvent from "../models/AdminEvent";

export type DraftEvent = PlayerEvent | AdminEvent;
