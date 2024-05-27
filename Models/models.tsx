/* eslint-disable prettier/prettier */
// models.ts

export interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    // other user properties
  }

  export interface SavingsBox {
    id: string;
    name: string;
    administrator: User;
    members: User[];
    // other savings box properties
  }

  export class SavingsBoxClass implements SavingsBox {
    id: string;
    name: string;
    administrator: User;
    members: User[];
    isNew: boolean;

    constructor(id: string, name: string, administrator: User, members: User[] = [], isNew: boolean = true) {
      this.id = id;
      this.name = name;
      this.administrator = administrator;
      this.members = members;
      this.isNew = isNew;
    }

    addMember(user: User) {
      this.members.push(user);
    }

    removeMember(user: User) {
      this.members = this.members.filter(member => member.id !== user.id);
    }

    changeAdministrator(user: User) {
      if (this.members.find(member => member.id === user.id)) {
        this.administrator = user;
      } else {
        throw new Error('The new administrator must be a member of the savings box.');
      }
    }
  }
