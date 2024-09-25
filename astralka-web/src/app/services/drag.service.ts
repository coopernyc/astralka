import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragService {

  private zoneIds: string[] = [];
  private availableZones: any = {};

  /**
   * Starts the drag operation for the specified zones.
   *
   * @param {string[]} zoneIds - The IDs of the zones to be highlighted.
   */
  public startDrag(zoneIds: string[]): void {
    this.zoneIds = zoneIds;
    this.highlightZones();
  }

  /**
   * Checks if a given zone ID can be dropped onto.
   *
   * @param {string} zoneId - The ID of the zone to check.
   * @returns {boolean} True if the zone can be dropped onto, false otherwise.
   */
  public canDrop(zoneId: string): boolean {
    return this.zoneIds.indexOf(zoneId) > -1;
  }

  /**
   * Hides the highlighting for all zones.
   */
  public dimZones(): void {
    this.zoneIds.forEach((zone: string) => {
      this.availableZones[zone].end();
    });
  }

  /**
   * Adds a new zone to the available zones.
   *
   * @param {string} zoneId - The ID of the new zone.
   * @param {{begin: Function, end: Function}} obj - An object with `begin` and `end` functions for highlighting and unhighlighting the zone.
   */
  public addZone(zoneId: string, obj: {begin: Function, end: Function}): void {
    this.availableZones[zoneId] = obj;
  }

  /**
   * Removes a zone from the available zones.
   *
   * @param {string} zoneId - The ID of the zone to remove.
   */
  public removeAvailableZone(zoneId: string): void {
    delete this.availableZones[zoneId];
  }

  /**
   * Highlights the specified zones.
   */
  public highlightZones(): void {
    this.zoneIds.forEach((zoneId: string) => {
      this.availableZones[zoneId].begin();
    });
  }

}
