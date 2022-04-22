import {
  DOMParser, Node, NodeList
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

type ActiveCall = {
  TimeReceived:string,
  Agency:string,
  DispatchArea:string,
  Unit:string,
  CallType:string,
  Location:string,
  Status:string
}

function mapCall(activeCallProperties:string[]): ActiveCall {
  return {
   TimeReceived:activeCallProperties[0],
   Agency:activeCallProperties[1],
   DispatchArea:activeCallProperties[2],
   Unit:activeCallProperties[3],
   CallType:activeCallProperties[4],
   Location:activeCallProperties[5],
   Status:activeCallProperties[6]
  }
}

function addToActiveCall(tableData:string) {
  console.log(`trying to add ${tableData}`)
if(!(tableData.startsWith("\n")))
  {
    return tableData
  }
}

// Call out to RPD for HTML Table Data of Active Calls
const response: Response = await fetch(
  "https://apps.richmondgov.com/applications/activecalls/Home/ActiveCalls",
  { headers: [["content-type", "text/html; charset=utf-8"]] }
)

// Parse the response into something usable
const doc = new DOMParser().parseFromString(await response.text(), "text/html");

const tableHeaders: string[] = []

doc?.querySelector('tr')?.childNodes.forEach(node=>{
  if(!node.textContent.startsWith("\n")) {
    tableHeaders.push(node.textContent)
}})!

const activeCalls: ActiveCall[] = [];
const tableData = doc?.querySelector('tbody')!
const tableRows = tableData.querySelectorAll('tr')!

tableRows.forEach((row:Node) => {

  const rowData = row.childNodes;
  const filteredRowData: string[] = []

  rowData?.forEach((d:Node)=>{
    if (!(d.textContent.startsWith('\n'))) {
      filteredRowData.push(d.textContent)
    }
  })

  activeCalls.push(mapCall(filteredRowData))
}
);

console.log(activeCalls);

