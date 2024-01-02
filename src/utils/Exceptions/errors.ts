import { CustomError, defaultErrors, DtoRouter } from '@appwise/express-dto-router'
import { EntityNotFoundError } from 'typeorm'

export const knownErrors = {
  ...defaultErrors,
  example_error: {
    detail: 'This is an example description',
    status: 400
  },
  max_amount_of_recipients_reached: {
    detail: 'The maximum amount of recipients has been reached',
    status: 400
  },
  unit_already_in_use: {
    detail: 'The unit is already in use',
    status: 400
  },
  reservation_code_already_used: {
    detail: 'The reservation code has already been used',
    status: 400
  },
  user_has_boxes: {
    detail: 'Unable to delete user when user has boxes',
    status: 400
  },
  unit_is_defect: {
    detail: 'The unit is defect',
    status: 400
  },
  recipient_has_active_delivery: {
    detail: 'The recipient has an active delivery',
    status: 400
  },
  invalid_box_type: {
    detail: 'The box type is invalid',
    status: 400
  },
  invalid_lockers: {
    detail: 'The amount of lockers is invalid',
    status: 400
  },
  invalid_amount: {
    detail: 'The amount is invalid',
    status: 400
  },
  box_has_active_delivery: {
    detail: 'The box has an active delivery',
    status: 400
  },
  box_has_active_reservation: {
    detail: 'The box has an active reservation',
    status: 400
  },
  deliverer_email_required: {
    detail: 'The deliverer email is required',
    status: 400
  }
}

type listTypes = keyof typeof knownErrors

CustomError.errors = knownErrors

export class KnownError extends CustomError<listTypes> {
}

DtoRouter.mapError = (error: Error) => {
  if (error instanceof EntityNotFoundError) return new KnownError('not_found')
  else return error
}
