import { ContractEntity } from "../src/Types.gen";

export function createContract(
  address: string,
  alias: string,
  category: string
): ContractEntity {
  const contractEntity: ContractEntity = {
    id: address,
    alias: alias,
    // TODO update this admin value to the correct one
    admin: "admin",
    address: address,
    category: category,
  };

  return contractEntity;
}
