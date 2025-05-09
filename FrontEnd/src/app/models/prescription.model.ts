import {Medication} from "./medication.model";

export interface Prescription {
  id: number;
  name: string;
  courseOfAction: string;
  dosageInstructions: string;
  duration: string;
  pathologyId: number;
  pathologyName: string;
  medications: Medication[];
}
