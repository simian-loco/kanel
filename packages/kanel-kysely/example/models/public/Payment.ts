// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { CustomerId } from './Customer';
import type { StaffId } from './Staff';
import type { RentalId } from './Rental';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

export type PaymentId = number;

/** Represents the table public.payment */
export default interface PaymentTable {
  payment_id: ColumnType<PaymentId, PaymentId | null, PaymentId | null>;

  customer_id: ColumnType<CustomerId, CustomerId, CustomerId | null>;

  staff_id: ColumnType<StaffId, StaffId, StaffId | null>;

  rental_id: ColumnType<RentalId, RentalId, RentalId | null>;

  amount: ColumnType<string, string, string | null>;

  payment_date: ColumnType<Date, Date | string, Date | string | null>;
}

export type Payment = Selectable<PaymentTable>;

export type NewPayment = Insertable<PaymentTable>;

export type PaymentUpdate = Updateable<PaymentTable>;