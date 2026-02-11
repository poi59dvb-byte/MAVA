import trackJson from '../data/tracks/track_01.json';
import type { TrackData } from '../utils/types';

export class TrackLoader {
  load(): TrackData {
    return trackJson as TrackData;
  }
}
