export enum ValidationId {
    VLD_000 = 'Draft is currently expecting actions',
    VLD_001 = 'Acting user is supposed to act according to preset',
    VLD_002 = 'Action is expected according to preset',

    VLD_100 = 'Civilisation has not been banned globally before',
    VLD_101 = 'Civilisation has not been banned before for same player',
    VLD_102 = 'Civilisation has not been exclusively picked before by the same player',
    VLD_103 = 'Civilisation has not been globally picked before by either player',

    VLD_200 = 'Civilisation has not been exclusively banned before by same player',

    VLD_300 = 'Civilisation has been picked before by opponent',
    VLD_301 = 'The opponent has a non-sniped pick of the civilisation'
}