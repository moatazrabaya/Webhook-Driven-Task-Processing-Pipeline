import { ActionType } from "../enums/actionType.js";

export function isActionType(value: any): value is ActionType {
  return Object.values(ActionType).includes(value);
}
