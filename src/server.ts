import {DraftServer} from "./DraftServer";

new DraftServer().serve(process.env.PORT || 3000);
