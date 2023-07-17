// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

export type ActorId = number;

/** Represents the table public.actor */
export default interface ActorTable {
  actor_id: ColumnType<ActorId, ActorId | null, ActorId | null>;

  first_name: ColumnType<string, string, string | null>;

  last_name: ColumnType<string, string, string | null>;

  last_update: ColumnType<Date, Date | string | null, Date | string | null>;
}

export type Actor = Selectable<ActorTable>;

export type NewActor = Insertable<ActorTable>;

export type ActorUpdate = Updateable<ActorTable>;