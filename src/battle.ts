import { _BattleStateChanged, _BetBattle, _CreateBattle } from "../generated/Battle/Battle";
import { Battle, Participant } from "../generated/schema";

export function handle_CreateBattle(event: _CreateBattle): void {
  let battle = new Battle(event.params._battleId.toString());

  battle.battleId = event.params._battleId;
  battle.exchange = event.params.exchange;
  battle.startTime = event.params.startTime;
  battle.endTime = event.params.endTime;
  battle.entryfee = event.params.entryFee;
  battle.nftCount = event.params.nftCount;
  battle.participants = [];
  battle.owner = event.params.owner.toHexString();
  battle.battleType = event.params.battleType.toString() == "0" ? "Health" : "Blood";
  battle.battleStatus = "Betting";

  battle.save();
}

export function handleBetBattle(event: _BetBattle): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let participant = new Participant(id);

  participant.battleId = event.params._battleId;
  participant.user = event.params._playerAddress;
  participant.billionsIds = event.params._nftIds;
  participant.scalarIds = event.params._scalarIds;
  participant.save();

  let battle = Battle.load(event.params._battleId.toString());

  if (!battle) return;

  let newParticipants = battle.participants;
  newParticipants.push(participant.id);
  battle.participants = newParticipants;
  battle.save();
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
