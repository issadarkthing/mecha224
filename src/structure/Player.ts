import { User } from "discord.js";
import { client } from "../index";


export class Player {
  user: User;
  coins = 0;

  constructor(user: User) {
    this.user = user;
  }

  get id() {
    return this.user.id;
  }

  get name() {
    return this.user.username;
  }

  get avatarUrl() {
    return this.user.avatarURL();
  }

  static fromUser(user: User) {

    const data = client.players.get(user.id);
    const player = new Player(user);

    if (data) {
      Object.assign(player, data);
    } else {
      player.save();
    }

    return player;
  }

  save() {
    const { user, ...data } = this;
    client.players.set(this.id, data);
  }
}
