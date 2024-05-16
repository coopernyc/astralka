import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragService {

  private zoneIds: string[] = [];
  private availableZones: any = {};

  public startDrag(zoneIds: string[]): void {
    this.zoneIds = zoneIds;
    this.highlightZones();
  }

  public canDrop(zoneId: string): boolean {
    return this.zoneIds.indexOf(zoneId) > -1;
  }

  public dimZones(): void {
    this.zoneIds.forEach((zone: string) => {
      this.availableZones[zone].end();
    });
  }

  public addZone(zoneId: string, obj: {begin: Function, end: Function}): void {
    this.availableZones[zoneId] = obj;
  }

  public removeAvailableZone(zoneId: string): void {
    delete this.availableZones[zoneId];
  }

  public highlightZones(): void {
    this.zoneIds.forEach((zoneId: string) => {
      this.availableZones[zoneId].begin();
    });
  }

}
