declare const eid: unique symbol
export type EID = number & {[eid]: never}

let eidCnt: EID = 0 as EID

export function EID(): EID {
  return ++eidCnt as EID
}
