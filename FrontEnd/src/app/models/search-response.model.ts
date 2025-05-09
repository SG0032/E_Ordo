import {Guideline} from "./guideline.model";
import {Prescription} from "./prescription.model";
import {Pathology} from "./pathology.model";

export interface SearchResponse {
  pathology: Pathology;
  prescriptions: Prescription[];
  guideline: Guideline;
}
