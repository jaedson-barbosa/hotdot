import { CutTypes, ImageModes, IPulse } from "browser-thermal-printer-encoder";
import { FontFamily } from "./fonts";

export interface IConfiguracoes {
  font: FontFamily;
  width: number;
  imageMode: ImageModes;
  paddingTop: number;
  paddingBottom: number;
  cutType: CutTypes;
  pulse: IPulse;
}

// {
//   corte: CutTypes.none,
//   fonte: 'Terminus-18-1',
//   imageMode: ImageModes.raster,
//   inferior: 2,
//   superior: 0,
//   width: 384,
//   offPulso: 100,
//   onPulso: 100,
//   pinoPulso: -1,
// }
