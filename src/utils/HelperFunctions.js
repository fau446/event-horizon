// used in EventEditingModal and EventCreationModal to format
// the address...
export function formatAddress(address) {
  if (address === undefined) return;

  return address.replace(/\s/g, "+");
}
