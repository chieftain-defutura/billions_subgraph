import { BigInt } from "@graphprotocol/graph-ts";
import {
  _BattleStateChanged,
  _BetBattle,
  _CreateBattle,
  _EndBattle as EndBattleEvent,
  Battle as BattleContract,
} from "../generated/Battle/Battle";
import { Battle, Participant, User } from "../generated/schema";

export function handle_CreateBattle(event: _CreateBattle): void {
  let battle = new Battle(event.params._battleId.toString());

  battle.battleId = event.params._battleId;
  battle.exchange = event.params.exchange;
  battle.startTime = event.params.startTime;
  battle.endTime = event.params.endTime;
  battle.entryfee = event.params.entryFee;
  battle.nftCount = event.params.nftCount;
  battle.participants = [];
  battle.bonuses = [];
  battle.rewards = [];
  battle.owner = event.params.owner.toHexString();
  battle.battleType = event.params.battleType.toString() == "0" ? "Health" : "Blood";
  battle.battleStatus = "Betting";
  battle.totalParticipants = BigInt.zero();

  battle.save();

  let user = User.load(event.params.owner.toHexString());

  if (!user) {
    let user = new User(event.params.owner.toHexString());
    user.save();
  }
}

export function handleBetBattle(event: _BetBattle): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let nftIds = event.params._nftIds;
  let scalarIds = event.params._scalarIds;
  let participant = new Participant(id);

  participant.battleId = event.params._battleId;
  participant.user = event.params._playerAddress.toHexString();

  let newNftIds: string[] = [];
  let newScalarIds: string[] = [];

  for (let i = 0; i < nftIds.length; i++) {
    newNftIds.push(nftIds[i].toString());
  }
  for (let i = 0; i < scalarIds.length; i++) {
    newScalarIds.push(scalarIds[i].toString());
  }

  participant.billionsIds = newNftIds;
  participant.scalarIds = newScalarIds;
  participant.save();

  let battle = Battle.load(event.params._battleId.toString());

  if (!battle) return;

  let newParticipants = battle.participants;
  newParticipants.push(participant.id);
  battle.participants = newParticipants;
  battle.totalParticipants = battle.totalParticipants.plus(BigInt.fromI32(1));
  battle.save();

  let user = User.load(event.params._playerAddress.toHexString());

  if (!user) {
    let user = new User(event.params._playerAddress.toHexString());
    user.save();
  }
}

export function handleBattleStateChanged(event: _BattleStateChanged): void {
  let battle = Battle.load(event.params._battleId.toString());

  if (!battle) return;

  let battleStatus = event.params.state.toString();

  if (battleStatus == "0") {
    battle.battleStatus = "Betting";
  }
  if (battleStatus == "1") {
    battle.battleStatus = "Started";
  }
  if (battleStatus == "2") {
    battle.battleStatus = "Ended";
  }
  if (battleStatus == "3") {
    battle.battleStatus = "Expired";
  }

  battle.save();
}

export function handleEndBattle(event: EndBattleEvent): void {
  let battle = event.params._battleId.toString();

  if (!battle) return;

  let battleContract = BattleContract.bind(event.address);
  let battleInfo = battleContract.GetBattle(event.params._battleId);
}
