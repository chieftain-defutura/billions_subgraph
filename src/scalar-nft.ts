import {
  MintNft as MintNftEvent,
  Transfer as TransferEvent,
} from "../generated/ScalarNFT/ScalarNFT";
import { ScalarNFT } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let token = ScalarNFT.load(event.params.tokenId.toString());
  if (!token) {
    let token = new ScalarNFT(event.params.tokenId.toString());
    token.owner = event.params.to.toHexString();
    token.tokenId = event.params.tokenId;

    token.save();
  }
}

export function handleMintNft(event: MintNftEvent): void {
  let tokenId = event.params.tokenId;
  let scalarValue = event.params.scalarValue;

  let token = ScalarNFT.load(tokenId.toString());

  if (!token) {
    token = new ScalarNFT(tokenId.toString());
    token.owner = event.params.user.toHexString();
    token.tokenId = tokenId;
  }

  token.value = scalarValue.toString();
  token.save();
}
