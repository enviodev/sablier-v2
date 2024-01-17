import * as crypto from "crypto";

function hashGeneric(val: any): string {
  const hash = crypto.createHash("sha256");

  hash.update(val.toString());

  return hash.digest("hex");
}

function hashString(str: string): string {
  const hash = crypto.createHash("sha256");

  hash.update(str);

  return hash.digest("hex");
}

function hashObject(obj: object): string {
  const hash = crypto.createHash("sha256");
  const serializedObj = JSON.stringify(obj);

  hash.update(serializedObj);

  return hash.digest("hex");
}

export function hash(objOrString: any): string {
  if (typeof objOrString === "string") {
    return hashString(objOrString);
  } else if (typeof objOrString === "object") {
    return hashObject(objOrString);
  } else {
    return hashGeneric(objOrString); // this might not be the best way to handle this, not sure how certain types will be converted .toString()
  }
}
