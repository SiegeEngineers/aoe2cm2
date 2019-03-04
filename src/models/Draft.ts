import Preset from "./Preset";

class Draft {
    public readonly nameHost:string;
    public readonly nameGuest:string;
    public readonly preset:Preset;
    // private replay:null = null; // TODO

    constructor(nameHost:string, nameGuest:string, preset:Preset){
        this.nameHost = nameHost;
        this.nameGuest = nameGuest;
        this.preset = preset;
    }
}

export default Draft