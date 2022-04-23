import {
  Document,
  DOMParser,
  Node,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

import { ActiveCall } from "./ActiveCall.ts";

/**
 * @param {string[]} activeCallProperties - sorted list representing the details of an
 * ActiveCall pulled from a HTML TableRow
 */
function mapRowDataToActiveCall(activeCallProperties: string[]): ActiveCall {
  return {
    TimeReceived: activeCallProperties[0],
    Agency: activeCallProperties[1],
    DispatchArea: activeCallProperties[2],
    Unit: activeCallProperties[3],
    CallType: activeCallProperties[4],
    Location: activeCallProperties[5],
    Status: activeCallProperties[6],
  };
}

/**
 * @description Fetches and maps ActiveCalls from the RPD Active Call scanner
 * @returns {ActiveCall}
 */
export async function fetchActiveCalls(): Promise<ActiveCall[]> {
  // Call out to RPD for HTML Table Data of Active Calls
  console.log('fetching...')
  const response: Response = await fetch(
    "https://apps.richmondgov.com/applications/activecalls/Home/ActiveCalls",
    { headers: [["content-type", "text/html; charset=utf-8"]] }
  );

  // Parse the response into something usable
  const doc: Document = new DOMParser().parseFromString(
    await response.text(),
    "text/html"
  )!;

  const tableHeaders: string[] = [];
  doc?.querySelector("tr")?.childNodes.forEach((node) => {
    if (!node.textContent.startsWith("\n")) {
      tableHeaders.push(node.textContent);
    }
  })!;

  const activeCalls: ActiveCall[] = [];
  const tableData = doc?.querySelector("tbody")!;
  const tableRows = tableData.querySelectorAll("tr")!;

  tableRows.forEach((row: Node) => {
    const rowData = row.childNodes;
    const filteredRowData: string[] = [];

    rowData?.forEach((d: Node) => {
      if (!d.textContent.startsWith("\n")) {
        filteredRowData.push(d.textContent);
      }
    });
    // ActiveCalls are returned sorted by Time ASC
    // Since we want latest, we unshift instead of push
    activeCalls.unshift(mapRowDataToActiveCall(filteredRowData));
  });
  return activeCalls 
}

let activeCalls: ActiveCall[] = await fetchActiveCalls();
let times = activeCalls.filter(x=>x.TimeReceived);
console.log(times)
